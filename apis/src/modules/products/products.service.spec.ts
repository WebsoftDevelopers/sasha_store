import { ForbiddenException } from '@nestjs/common';
import { ProductsService } from './products.service';

jest.mock('../../../generated/prisma/client', () => ({
  PrismaClient: class PrismaClient {},
  Prisma: {
    Decimal: class Decimal {
      constructor(readonly value: number) {}
    },
  },
}));

describe('ProductsService vendor approval gate', () => {
  it('requires an approved vendor before creating products', async () => {
    const prisma = { product: { create: jest.fn() } };
    const shopsService = {
      requireApprovedMine: jest.fn().mockRejectedValue(new ForbiddenException()),
    };
    const service = new ProductsService(prisma as any, shopsService as any);

    await expect(
      service.create('user-1', { name: 'Perfume', price: 1000 }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.product.create).not.toHaveBeenCalled();
  });
});
