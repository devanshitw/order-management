import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderService } from 'src/modules/order/order.service';
import { OfferService } from 'src/modules/offer/offer.service';
import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { Cart } from 'src/database/entities/cart.entity';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { OrderStatus } from 'src/common/types/order.types';
import { CustomLogger } from 'src/common/logger';

describe('OrderService', () => {
  let service: OrderService;
  const mockOrderRepo = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
  const mockOrderItemRepo = {};
  const mockCartRepo = {
    findOne: jest.fn(),
  };
  const mockCartItemRepo = {};
  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    query: jest.fn(),
    manager: {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    },
  };
  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };
  const mockLogger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
  const mockOfferService = {
    validateCoupon: jest.fn(),
    calculateDiscount: jest.fn(),
    getActiveOffers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepo },
        { provide: getRepositoryToken(Cart), useValue: mockCartRepo },
        { provide: getRepositoryToken(CartItem), useValue: mockCartItemRepo },
        { provide: DataSource, useValue: mockDataSource },
        { provide: CustomLogger, useValue: mockLogger },
        { provide: OfferService, useValue: mockOfferService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('placeOrder', () => {
    it('should throw BadRequestException for empty cart', async () => {
      mockCartRepo.findOne.mockResolvedValue({ items: [] });

      await expect(
        service.placeOrder('user-1', { delivery_address: '123 Main St' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when cart not found', async () => {
      mockCartRepo.findOne.mockResolvedValue(null);

      await expect(
        service.placeOrder('user-1', { delivery_address: '123 Main St' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should place order successfully from cart', async () => {
      mockCartRepo.findOne.mockResolvedValue({
        id: 'cart-1',
        items: [
          { menu_item_id: 'item-1', quantity: 2, unit_price: 12.99 },
        ],
      });
      mockQueryRunner.query.mockResolvedValue([{ seq: 1 }]);
      mockQueryRunner.manager.create.mockImplementation((_, data) => data);
      mockQueryRunner.manager.save.mockImplementation((_, data) => ({
        ...data,
        id: 'order-1',
      }));
      mockQueryRunner.manager.delete.mockResolvedValue({ affected: 1 });

      const result = await service.placeOrder('user-1', {
        delivery_address: '123 Main St',
      });

      expect(result.message).toBe('Order placed successfully');
      expect(result.order.order_number).toBe('ORD-0001');
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  describe('getOrders', () => {
    it('should return paginated orders', async () => {
      mockOrderRepo.findAndCount.mockResolvedValue([
        [{ id: 'order-1', order_number: 'ORD-0001' }],
        1,
      ]);

      const result = await service.getOrders('user-1');

      expect(result.orders).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getOrder', () => {
    it('should throw NotFoundException for non-existent order', async () => {
      mockOrderRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getOrder('user-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update status forward', async () => {
      mockOrderRepo.findOne.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PLACED,
      });
      mockOrderRepo.save.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CONFIRMED,
      });

      const result = await service.updateStatus('user-1', 'order-1', {
        status: OrderStatus.CONFIRMED,
      });

      expect(result.status).toBe(OrderStatus.CONFIRMED);
    });

    it('should not allow backward status transition', async () => {
      mockOrderRepo.findOne.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.PREPARING,
      });

      await expect(
        service.updateStatus('user-1', 'order-1', {
          status: OrderStatus.CONFIRMED,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should not update already delivered order', async () => {
      mockOrderRepo.findOne.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.DELIVERED,
      });

      await expect(
        service.updateStatus('user-1', 'order-1', {
          status: OrderStatus.PREPARING,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
