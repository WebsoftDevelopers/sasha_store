import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: string, dto: CreateRatingDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, isActive: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    const purchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: dto.productId,
        order: {
          buyerId: userId,
          status: {
            in: [
              OrderStatus.CONFIRMED,
              OrderStatus.SHIPPED,
              OrderStatus.DELIVERED,
            ],
          },
        },
      },
    });
    if (!purchased) {
      throw new BadRequestException('Only buyers can review this product');
    }

    return this.prisma.rating.upsert({
      where: {
        productId_userId: { productId: dto.productId, userId },
      },
      create: {
        productId: dto.productId,
        userId,
        score: dto.score,
        comment: dto.comment,
      },
      update: {
        score: dto.score,
        comment: dto.comment,
      },
    });
  }

  async forProduct(productId: string) {
    return this.prisma.rating.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, fullName: true } },
      },
    });
  }

  async forMyShopProducts(ownerId: string) {
    return this.prisma.rating.findMany({
      where: { product: { shop: { ownerId } } },
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, imageUrl: true } },
        user: { select: { id: true, fullName: true } },
      },
    });
  }
}
