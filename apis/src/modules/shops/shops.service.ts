import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, VendorStatus } from '../../../generated/prisma/client';
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

function applicationData(dto: CreateShopDto | UpdateShopDto) {
  return {
    name: dto.name,
    description: dto.description,
    logoUrl: dto.logoUrl,
    bannerUrl: dto.bannerUrl,
    category: dto.category,
    ownerFirstName: dto.ownerFirstName,
    ownerLastName: dto.ownerLastName,
    ownerEmail: dto.ownerEmail,
    ownerPhone: dto.ownerPhone,
    alternativePhone: dto.alternativePhone,
    identificationType: dto.identificationType,
    identificationNumber: dto.identificationNumber,
    legalName: dto.legalName,
    registeredBusinessName: dto.registeredBusinessName,
    cacNumber: dto.cacNumber,
    businessRegistrationType: dto.businessRegistrationType,
    tin: dto.tin,
    registrationDate: dto.registrationDate
      ? new Date(dto.registrationDate)
      : undefined,
    businessAddress: dto.businessAddress,
    country: dto.country,
    city: dto.city,
    state: dto.state,
    lga: dto.lga,
    streetAddress: dto.streetAddress,
    postalCode: dto.postalCode,
    latitude:
      dto.latitude === undefined ? undefined : new Prisma.Decimal(dto.latitude),
    longitude:
      dto.longitude === undefined
        ? undefined
        : new Prisma.Decimal(dto.longitude),
    phone: dto.phone,
    email: dto.email,
    businessPhone: dto.businessPhone,
    businessEmail: dto.businessEmail,
    website: dto.website,
    socialLinks: dto.socialLinks ?? undefined,
    cacDocumentUrl: dto.cacDocumentUrl,
    idDocumentUrl: dto.idDocumentUrl,
    proofOfAddressUrl: dto.proofOfAddressUrl,
    businessRegistrationDocumentUrl: dto.businessRegistrationDocumentUrl,
    taxCertificateUrl: dto.taxCertificateUrl,
    additionalDocumentUrls: dto.additionalDocumentUrls ?? undefined,
  };
}

function createApplicationData(dto: CreateShopDto) {
  return {
    ...applicationData(dto),
    name: dto.name,
    legalName: dto.legalName,
    cacNumber: dto.cacNumber,
    businessAddress: dto.businessAddress,
    city: dto.city,
    state: dto.state,
    phone: dto.phone,
    email: dto.email,
  };
}

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateShopDto) {
    const existing = await this.prisma.shop.findUnique({ where: { ownerId } });
    if (existing) {
      if (existing.vendorStatus === VendorStatus.REJECTED) {
        return this.resubmit(ownerId, dto);
      }
      throw new ConflictException('You already have a vendor application.');
    }

    let slug = slugify(dto.name) || `shop-${ownerId.slice(0, 8)}`;
    const slugTaken = await this.prisma.shop.findUnique({ where: { slug } });
    if (slugTaken) slug = `${slug}-${Date.now().toString(36)}`;

    return this.prisma.shop.create({
      data: {
        ownerId,
        slug,
        ...createApplicationData(dto),
        vendorStatus: VendorStatus.PENDING,
        isVerified: false,
        adminComment: null,
        rejectionReason: null,
        missingDocuments: Prisma.JsonNull,
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
    const shop = await this.prisma.shop.findFirst({
      where: { slug, vendorStatus: VendorStatus.APPROVED },
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
    if (
      shop.vendorStatus === VendorStatus.PENDING ||
      shop.vendorStatus === VendorStatus.SUSPENDED ||
      shop.vendorStatus === VendorStatus.DISABLED
    ) {
      throw new BadRequestException(
        'This vendor application cannot be edited right now',
      );
    }
    return this.prisma.shop.update({
      where: { id: shop.id },
      data: applicationData(dto),
    });
  }

  async resubmit(ownerId: string, dto?: UpdateShopDto) {
    const shop = await this.requireMine(ownerId);
    if (shop.vendorStatus !== VendorStatus.REJECTED) {
      throw new BadRequestException(
        'Only rejected applications can be resubmitted',
      );
    }
    return this.prisma.shop.update({
      where: { id: shop.id },
      data: {
        ...(dto ? applicationData(dto) : {}),
        vendorStatus: VendorStatus.PENDING,
        isVerified: false,
        adminComment: 'Resubmitted for review',
        rejectionReason: null,
        missingDocuments: Prisma.JsonNull,
        reviewedAt: null,
        reviewedById: null,
      },
    });
  }

  async approve(admin: boolean, adminId: string, shopId: string, note?: string) {
    if (!admin) throw new ForbiddenException('Admin only');
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    return this.prisma.shop.update({
      where: { id: shopId },
      data: {
        vendorStatus: VendorStatus.APPROVED,
        isVerified: true,
        adminComment: note || 'Approved',
        rejectionReason: null,
        missingDocuments: Prisma.JsonNull,
        reviewedAt: new Date(),
        reviewedById: adminId,
      },
    });
  }

  async reject(
    admin: boolean,
    adminId: string,
    shopId: string,
    body?: { reason?: string; comment?: string; missingDocuments?: string[] },
  ) {
    if (!admin) throw new ForbiddenException('Admin only');
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    return this.prisma.shop.update({
      where: { id: shopId },
      data: {
        vendorStatus: VendorStatus.REJECTED,
        isVerified: false,
        adminComment: body?.comment || 'Rejected',
        rejectionReason: body?.reason || 'Application rejected',
        missingDocuments: body?.missingDocuments ?? Prisma.JsonNull,
        reviewedAt: new Date(),
        reviewedById: adminId,
      },
    });
  }

  async setStatus(
    admin: boolean,
    adminId: string,
    shopId: string,
    status: 'SUSPENDED' | 'DISABLED',
    comment?: string,
  ) {
    if (!admin) throw new ForbiddenException('Admin only');
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    return this.prisma.shop.update({
      where: { id: shopId },
      data: {
        vendorStatus: status,
        isVerified: false,
        adminComment: comment || status.toLowerCase(),
        reviewedAt: new Date(),
        reviewedById: adminId,
      },
    });
  }

  async listAdmin(admin: boolean, status?: VendorStatus) {
    if (!admin) throw new ForbiddenException('Admin only');
    return this.prisma.shop.findMany({
      where: status ? { vendorStatus: status } : undefined,
      orderBy: { updatedAt: 'asc' },
      include: {
        owner: { select: { id: true, email: true, fullName: true } },
        _count: { select: { products: true, orders: true } },
      },
    });
  }

  async getAdmin(admin: boolean, shopId: string) {
    if (!admin) throw new ForbiddenException('Admin only');
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        owner: { select: { id: true, email: true, fullName: true } },
        products: { orderBy: { createdAt: 'desc' }, take: 8 },
        _count: { select: { products: true, orders: true } },
      },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async requireMine(ownerId: string) {
    const shop = await this.prisma.shop.findUnique({ where: { ownerId } });
    if (!shop) throw new NotFoundException('Create a shop first');
    return shop;
  }

  async requireApprovedMine(ownerId: string) {
    const shop = await this.requireMine(ownerId);
    if (shop.vendorStatus !== VendorStatus.APPROVED) {
      throw new ForbiddenException('Vendor approval is required');
    }
    return shop;
  }
}
