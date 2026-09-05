import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VerificationStatus } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateShopDto) {
    const existing = await this.prisma.shop.findUnique({ where: { ownerId } });
    if (existing) {
      throw new ConflictException(
        'You already have a shop. One shop per user.',
      );
    }

    let slug = slugify(dto.name) || `shop-${ownerId.slice(0, 8)}`;
    const slugTaken = await this.prisma.shop.findUnique({ where: { slug } });
    if (slugTaken) slug = `${slug}-${Date.now().toString(36)}`;

    return this.prisma.shop.create({
      data: {
        ownerId,
        name: dto.name,
        slug,
        description: dto.description,
        logoUrl: dto.logoUrl,
        legalName: dto.legalName,
        cacNumber: dto.cacNumber,
        tin: dto.tin,
        businessAddress: dto.businessAddress,
        city: dto.city,
        state: dto.state,
        phone: dto.phone,
        email: dto.email,
        cacDocumentUrl: dto.cacDocumentUrl,
        idDocumentUrl: dto.idDocumentUrl,
        proofOfAddressUrl: dto.proofOfAddressUrl,
      },
    });
  }

  async getMine(ownerId: string) {
    return this.prisma.shop.findUnique({
      where: { ownerId },
      include: {
        _count: { select: { products: true, orders: true } },
      },
    });
  }

  async getBySlug(slug: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { products: true } },
      },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async updateMine(ownerId: string, dto: UpdateShopDto) {
    const shop = await this.requireMine(ownerId);
    return this.prisma.shop.update({
      where: { id: shop.id },
      data: { ...dto },
    });
  }

  async submitVerification(ownerId: string) {
    const shop = await this.requireMine(ownerId);
    if (!shop.cacDocumentUrl || !shop.idDocumentUrl) {
      throw new BadRequestException(
        'Upload CAC document and ID document before submitting verification',
      );
    }
    if (!shop.cacNumber || !shop.legalName || !shop.businessAddress) {
      throw new BadRequestException(
        'Complete CAC number, legal name, and business address first',
      );
    }
    return this.prisma.shop.update({
      where: { id: shop.id },
      data: {
        verificationStatus: VerificationStatus.PENDING,
        verificationNote: 'Submitted for review',
      },
    });
  }

  async verifyShop(
    admin: boolean,
    shopId: string,
    approve: boolean,
    note?: string,
  ) {
    if (!admin) throw new ForbiddenException('Admin only');
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    return this.prisma.shop.update({
      where: { id: shopId },
      data: approve
        ? {
            verificationStatus: VerificationStatus.VERIFIED,
            isVerified: true,
            verifiedAt: new Date(),
            verificationNote: note || 'Verified',
          }
        : {
            verificationStatus: VerificationStatus.REJECTED,
            isVerified: false,
            verifiedAt: null,
            verificationNote: note || 'Rejected',
          },
    });
  }

  async listPending(admin: boolean) {
    if (!admin) throw new ForbiddenException('Admin only');
    return this.prisma.shop.findMany({
      where: { verificationStatus: VerificationStatus.PENDING },
      orderBy: { updatedAt: 'asc' },
    });
  }

  async requireMine(ownerId: string) {
    const shop = await this.prisma.shop.findUnique({ where: { ownerId } });
    if (!shop) throw new NotFoundException('Create a shop first');
    return shop;
  }
}
