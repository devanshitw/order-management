import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MenuService } from 'src/modules/menu/menu.service';
import { MenuItem } from 'src/database/entities/menu-item.entity';
import { Category } from 'src/database/entities/category.entity';
import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { CustomLogger } from 'src/common/logger';

describe('MenuService', () => {
  let service: MenuService;
  const mockMenuItemRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const mockCategoryRepo = {
    find: jest.fn(),
  };
  const mockOrderRepo = {};
  const mockOrderItemRepo = {
    createQueryBuilder: jest.fn(),
  };
  const mockLogger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: getRepositoryToken(MenuItem), useValue: mockMenuItemRepo },
        { provide: getRepositoryToken(Category), useValue: mockCategoryRepo },
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepo },
        { provide: CustomLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return active categories sorted by sort_order', async () => {
      const categories = [
        { id: '1', name: 'Appetizers', sort_order: 1 },
        { id: '2', name: 'Main Course', sort_order: 2 },
      ];
      mockCategoryRepo.find.mockResolvedValue(categories);

      const result = await service.getCategories();

      expect(result).toEqual(categories);
      expect(mockCategoryRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { sort_order: 'ASC' },
      });
    });
  });

  describe('getMenuItem', () => {
    it('should return a menu item by id', async () => {
      const item = { id: 'item-1', name: 'Pizza', price: 12.99 };
      mockMenuItemRepo.findOne.mockResolvedValue(item);

      const result = await service.getMenuItem('item-1');

      expect(result).toEqual(item);
    });

    it('should throw NotFoundException for non-existent item', async () => {
      mockMenuItemRepo.findOne.mockResolvedValue(null);

      await expect(service.getMenuItem('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getMenuItems', () => {
    it('should return paginated menu items', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [{ id: '1', name: 'Pizza' }],
          1,
        ]),
      };
      mockMenuItemRepo.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.getMenuItems({ page: 1, limit: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });
});
