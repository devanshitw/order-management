import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from '../../modules/cart/cart.service';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { CustomLogger } from '../../common/logger';

describe('CartService', () => {
  let service: CartService;
  const mockCartRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockCartItemRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };
  const mockMenuItemRepo = {
    findOne: jest.fn(),
  };
  const mockLogger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useValue: mockCartRepo },
        { provide: getRepositoryToken(CartItem), useValue: mockCartItemRepo },
        { provide: getRepositoryToken(MenuItem), useValue: mockMenuItemRepo },
        { provide: CustomLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should create a cart if none exists and return empty cart', async () => {
      mockCartRepo.findOne
        .mockResolvedValueOnce(null) // getOrCreateCart check
        .mockResolvedValueOnce({ id: 'cart-1', items: [] }); // getCart with relations

      mockCartRepo.create.mockReturnValue({ user_id: 'user-1' });
      mockCartRepo.save.mockResolvedValue({ id: 'cart-1', user_id: 'user-1' });

      const result = await service.getCart('user-1');

      expect(result.items).toEqual([]);
      expect(result.total_amount).toBe(0);
    });
  });

  describe('addItem', () => {
    it('should throw NotFoundException for unavailable menu item', async () => {
      mockMenuItemRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addItem('user-1', {
          menu_item_id: 'non-existent',
          quantity: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('should throw NotFoundException for non-existent cart item', async () => {
      mockCartRepo.findOne.mockResolvedValue({ id: 'cart-1' });
      mockCartItemRepo.findOne.mockResolvedValue(null);

      await expect(
        service.removeItem('user-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      mockCartRepo.findOne.mockResolvedValue({ id: 'cart-1' });
      mockCartItemRepo.delete.mockResolvedValue({ affected: 3 });

      const result = await service.clearCart('user-1');

      expect(result.items).toEqual([]);
      expect(result.total_amount).toBe(0);
      expect(result.item_count).toBe(0);
    });
  });
});
