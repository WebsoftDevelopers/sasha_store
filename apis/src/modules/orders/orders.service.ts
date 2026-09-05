import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(buyerId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products are unavailable');
    }

    const shopIds = new Set(products.map((p) => p.shopId));
    if (shopIds.size !== 1) {
      throw new BadRequestException(
        'Checkout one shop at a time. Sellers manage their own logistics.',
      );
    }
    const shopId = products[0].shopId;
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (shop?.ownerId === buyerId) {
      throw new BadRequestException('You cannot buy from your own shop');
    }

    const byId = new Map(products.map((p) => [p.id, p]));
    let total = new Prisma.Decimal(0);
    const lines = dto.items.map((item) => {
      const product = byId.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
      const line = product.price.mul(item.quantity);
      total = total.add(line);
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        name: product.name,
      };
    });

    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        const product = byId.get(item.productId)!;
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          buyerId,
          shopId,
          status: OrderStatus.PENDING,
          totalAmount: total,
          shippingAddress: dto.shippingAddress,
          shippingCity: dto.shippingCity,
          shippingState: dto.shippingState,
          shippingPhone: dto.shippingPhone,
          notes: dto.notes,
          items: { create: lines },
        },
        include: { items: true, shop: true },
      });
    });
  }

  async myPurchases(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            isVerified: true,
            phone: true,
          },
        },
      },
    });
  }

  async mySales(ownerId: string) {
    return this.prisma.order.findMany({
      where: { shop: { ownerId } },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        buyer: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async updateSaleStatus(
    ownerId: string,
    orderId: string,
    status: OrderStatus,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, shop: { ownerId } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });
  }

  async dashboard(userId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
      include: { _count: { select: { products: true, orders: true } } },
    });

    const [purchases, sales, productCount] = await Promise.all([
      this.prisma.order.count({ where: { buyerId: userId } }),
      shop
        ? this.prisma.order.count({ where: { shopId: shop.id } })
        : Promise.resolve(0),
      shop
        ? this.prisma.product.count({ where: { shopId: shop.id } })
        : Promise.resolve(0),
    ]);

    return {
      shop,
      stats: {
        products: productCount,
        purchases,
        sales,
      },
    };
  }

  assertOwner(isOwner: boolean) {
    if (!isOwner) throw new ForbiddenException();
  }
}
