import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { MediaAssetType, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const provider = this.configService.get<string>('storage.provider') || 's3';
    if (provider !== 's3') {
      throw new Error(
        `Unsupported storage provider "${provider}". Use "s3" for MinIO, AWS S3, Cloudflare R2, Backblaze B2, or any S3-compatible service.`,
      );
    }

    const endpoint = this.configService.getOrThrow<string>('storage.endpoint');
    this.bucket = this.configService.get<string>('storage.bucket') || 'sasha-store';
    this.publicUrl = this.configService.get<string>('storage.publicUrl') || endpoint;

    this.s3 = new S3Client({
      endpoint,
      region: this.configService.get<string>('storage.region') || 'us-east-1',
      forcePathStyle: this.configService.get<boolean>('storage.forcePathStyle') ?? true,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('storage.accessKey'),
        secretAccessKey: this.configService.getOrThrow<string>('storage.secretKey'),
      },
    });
  }

  async uploadFile(
    ownerId: string,
    file: Express.Multer.File,
    context = 'product',
  ): Promise<{ url: string; publicId: string; assetId: string }> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('File is required');
    }

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
    ];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, WebP, GIF, and PDF files are allowed',
      );
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException('File must be 10MB or smaller');
    }

    const extension = extname(file.originalname || '').toLowerCase();
    const safeExtension = extension && extension.length <= 8 ? extension : '';
    const isImage = file.mimetype.startsWith('image/');
    const safeContext = context
      .toLowerCase()
      .replace(/[^a-z0-9-_:/]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 100);
    const folder = [
      'public',
      ownerId,
      safeContext || (isImage ? 'product' : 'document'),
    ].join('/');
    const key = [folder, `${randomUUID()}${safeExtension}`].join('/');

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
        Metadata: {
          owner_id: ownerId,
        },
      }),
    );

    const publicUrl = `${this.publicUrl.replace(/\/$/, '')}/${this.bucket}/${key}`;

    const asset = await this.createAsset(ownerId, {
      assetType: isImage ? MediaAssetType.IMAGE : MediaAssetType.DOCUMENT,
      context,
      url: publicUrl,
      secureUrl: publicUrl,
      publicId: key,
      resourceType: isImage ? 'image' : 'raw',
      format: safeExtension.replace('.', '') || undefined,
      mimeType: file.mimetype,
      bytes: file.size,
      folder,
    });

    return {
      url: publicUrl,
      publicId: key,
      assetId: asset.id,
    };
  }

  async createAsset(ownerId: string, dto: CreateMediaAssetDto) {
    return this.prisma.mediaAsset.upsert({
      where: { publicId: dto.publicId },
      update: {
        assetType: dto.assetType,
        context: dto.context,
        entityType: dto.entityType,
        entityId: dto.entityId,
        url: dto.url,
        secureUrl: dto.secureUrl,
        resourceType: dto.resourceType,
        format: dto.format,
        mimeType: dto.mimeType,
        bytes: dto.bytes,
        width: dto.width,
        height: dto.height,
        provider: this.configService.get<string>('storage.provider') || 's3',
        folder: dto.folder,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
      create: {
        ownerId,
        assetType: dto.assetType,
        context: dto.context,
        entityType: dto.entityType,
        entityId: dto.entityId,
        url: dto.url,
        secureUrl: dto.secureUrl,
        publicId: dto.publicId,
        resourceType: dto.resourceType,
        format: dto.format,
        mimeType: dto.mimeType,
        bytes: dto.bytes,
        width: dto.width,
        height: dto.height,
        provider: this.configService.get<string>('storage.provider') || 's3',
        folder: dto.folder,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async listMine(ownerId: string, context?: string) {
    return this.prisma.mediaAsset.findMany({
      where: {
        ownerId,
        ...(context ? { context } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
