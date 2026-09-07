import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { ShopsService } from './shops.service';

jest.mock('../../../generated/prisma/client', () => ({
  PrismaClient: class PrismaClient {},
  Prisma: {
    Decimal: class Decimal {
      constructor(readonly value: number) {}
    },
    JsonNull: null,
  },
  VendorStatus: {
    NONE: 'NONE',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    SUSPENDED: 'SUSPENDED',
    DISABLED: 'DISABLED',
  },
}));

const VendorStatus = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
  DISABLED: 'DISABLED',
} as const;

const dto = {
  name: 'Sasha Beauty',
  ownerFirstName: 'Sasha',
  ownerLastName: 'Owner',
  ownerEmail: 'owner@example.com',
  ownerPhone: '+2348012345678',
  identificationType: 'National ID',
  identificationNumber: 'ID-12345',
  legalName: 'Sasha Beauty Ltd',
  cacNumber: 'RC-12345',
  businessAddress: '1 Market Road',
  city: 'Port Harcourt',
  state: 'Rivers',
  phone: '+2348012345678',
  email: 'store@example.com',
};

describe('ShopsService vendor lifecycle', () => {
  function service(existing: any = null) {
    const prisma = {
      shop: {
        findUnique: jest.fn().mockResolvedValue(existing),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve(data)),
        update: jest.fn().mockImplementation(({ data }) => Promise.resolve(data)),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    return { prisma, shopsService: new ShopsService(prisma as any) };
  }

  it('creates a pending vendor application', async () => {
    const { prisma, shopsService } = service(null);
    prisma.shop.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const result = await shopsService.create('user-12345678', dto);

    expect(result.vendorStatus).toBe(VendorStatus.PENDING);
    expect(result.slug).toBe('sasha-beauty');
    expect(prisma.shop.create).toHaveBeenCalledTimes(1);
  });

  it('prevents duplicate pending or approved submissions', async () => {
    const { shopsService } = service({ id: 'shop-1', vendorStatus: VendorStatus.PENDING });

    await expect(shopsService.create('user-1', dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('allows rejected applications to resubmit', async () => {
    const existing = { id: 'shop-1', vendorStatus: VendorStatus.REJECTED };
    const { prisma, shopsService } = service(existing);

    await shopsService.resubmit('user-1', dto);

    expect(prisma.shop.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ vendorStatus: VendorStatus.PENDING }),
      }),
    );
  });

  it('blocks resubmit unless the application was rejected', async () => {
    const { shopsService } = service({ id: 'shop-1', vendorStatus: VendorStatus.PENDING });

    await expect(shopsService.resubmit('user-1', dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('requires admin permissions for approval', async () => {
    const { shopsService } = service({ id: 'shop-1', vendorStatus: VendorStatus.PENDING });

    await expect(
      shopsService.approve(false, 'admin-1', 'shop-1'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
