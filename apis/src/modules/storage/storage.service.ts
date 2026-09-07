import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { MediaAssetType, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';

@Injectable()
export class StorageService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>('cloudinary.cloudName'),
      api_key: this.configService.getOrThrow<string>('cloudinary.apiKey'),
      api_secret: this.configService.getOrThrow<string>('cloudinary.apiSecret'),
      secure: true,
    });
  }

  async uploadImage(
    ownerId: string,
    file: Express.Multer.File,
  ): Promise<{ url: string; publicId: string; assetId: string }> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Image file is required');
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, WebP, and GIF images are allowed',
      );
    }

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException('Image must be 5MB or smaller');
    }

    const folder = this.configService.get<string>('cloudinary.folder');

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          overwrite: false,
        },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error ?? new Error('Cloudinary upload failed'));
            return;
          }
          resolve(uploaded);
        },
      );
      stream.end(file.buffer);
    });

    const asset = await this.createAsset(ownerId, {
      assetType: MediaAssetType.IMAGE,
      context: 'server-upload',
      url: result.secure_url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: 'image',
      format: result.format,
      mimeType: file.mimetype,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      folder,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
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
