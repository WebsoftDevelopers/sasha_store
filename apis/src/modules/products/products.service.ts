import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ShopsService } from '../shops/shops.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ListProductsQueryDto,
  type ProductSort,
} from './dto/list-products-query.dto';

function orderByForSort(
  sort: ProductSort = 'newest',
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'oldest':
      return { createdAt: 'asc' };
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'name_asc':
      return { name: 'asc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shopsService: ShopsService,
  ) {}

  async create(ownerId: string, dto: CreateProductDto) {
    const shop = await this.shopsService.requireApprovedMine(ownerId);
    return this.prisma.product.create({
      data: {
        shopId: shop.id,
        name: dto.name,
        description: dto.description,
        price: new Prisma.Decimal(dto.price),
        category: dto.category,
        imageUrl: dto.imageUrl,
        stock: dto.stock ?? 0,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            isVerified: true,
          },
        },
      },
    });
  }

  async findAllPublic(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const sort = query.sort ?? 'newest';
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      shop: { vendorStatus: 'APPROVED' },
      ...(query.category ? { category: query.category } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...((query.minPrice != null || query.maxPrice != null) && {
        price: {
          ...(query.minPrice != null ? { gte: query.minPrice } : {}),
          ...(query.maxPrice != null ? { lte: query.maxPrice } : {}),
        },
      }),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: orderByForSort(sort),
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          imageUrl: true,
          stock: true,
          createdAt: true,
          shop: {
            select: {
              id: true,
              name: true,
              slug: true,
              isVerified: true,
              city: true,
              state: true,
            },
          },
          _count: { select: { ratings: true } },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findMine(ownerId: string) {
    const shop = await this.shopsService.requireApprovedMine(ownerId);
    return this.prisma.product.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { ratings: true, orderItems: true } },
      },
    });
  }

  async findOnePublic(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, isActive: true, shop: { vendorStatus: 'APPROVED' } },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            isVerified: true,
            city: true,
            state: true,
            description: true,
          },
        },
        ratings: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            user: { select: { id: true, fullName: true } },
          },
        },
        _count: { select: { ratings: true } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const ratingStats = await this.prisma.rating.aggregate({
      where: { productId: product.id },
      _avg: { score: true },
    });

    return { ...product, averageRating: ratingStats._avg.score };
  }

  async update(id: string, ownerId: string, dto: UpdateProductDto) {
    const shop = await this.shopsService.requireApprovedMine(ownerId);
    const existing = await this.prisma.product.findFirst({
      where: { id, shopId: shop.id },
    });
    if (!existing) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price:
          dto.price === undefined ? undefined : new Prisma.Decimal(dto.price),
        category: dto.category,
        imageUrl: dto.imageUrl,
        stock: dto.stock,
        isActive: dto.isActive,
      },
    });
  }

  async remove(id: string, ownerId: string) {
    const shop = await this.shopsService.requireApprovedMine(ownerId);
    const existing = await this.prisma.product.findFirst({
      where: { id, shopId: shop.id },
    });
    if (!existing) throw new NotFoundException('Product not found');
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted' };
  }
}
