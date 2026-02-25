import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { Category } from '../../database/entities/category.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { OrderStatus } from '../../common/types/order.types';
import { QueryMenuDto } from './dto/query-menu.dto';
import { errorMessage } from '../../common/utils/error.message';
import { CustomLogger } from '../../common/logger';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly logger: CustomLogger,
  ) {}

  async getCategories() {
    try {
      return this.categoryRepo.find({
        where: { is_active: true },
        order: { sort_order: 'ASC' },
      });
    } catch (error) {
      this.logger.error('GET_CATEGORIES_ERROR: ', error);
      throw error;
    }
  }

  async getMenuItems(query: QueryMenuDto) {
    try {
      const { category_id, search, page = 1, limit = 20 } = query;

      const qb = this.menuItemRepo
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.category', 'category')
        .where('item.is_deleted = false')
        .andWhere('item.is_available = true');

      if (category_id) {
        qb.andWhere('item.category_id = :category_id', { category_id });
      }

      if (search) {
        qb.andWhere(
          '(LOWER(item.name) LIKE :search OR LOWER(item.description) LIKE :search)',
          { search: `%${search.toLowerCase()}%` },
        );
      }

      qb.orderBy('category.sort_order', 'ASC')
        .addOrderBy('item.name', 'ASC')
        .skip((page - 1) * limit)
        .take(limit);

      const [items, total] = await qb.getManyAndCount();

      return {
        items,
        meta: {
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('GET_MENU_ITEMS_ERROR: ', error);
      throw error;
    }
  }

  async getMenuItem(id: string) {
    try {
      const item = await this.menuItemRepo.findOne({
        where: { id, is_deleted: false },
        relations: ['category'],
      });

      if (!item) {
        throw new NotFoundException(errorMessage.MENU.ITEM_NOT_FOUND);
      }

      return item;
    } catch (error) {
      this.logger.error('GET_MENU_ITEM_ERROR: ', error);
      throw error;
    }
  }

  async getRecommendations(userId?: string, limit = 8): Promise<MenuItem[]> {
    try {
      // If authenticated, try personalized recommendations
      if (userId) {
        const items = await this.getPersonalizedRecommendations(userId, limit);
        if (items.length > 0) return items;
      }

      // Fallback: most-ordered items (popular dishes)
      const popular = await this.getPopularItems(limit);
      if (popular.length > 0) return popular;

      // Final fallback: random available items
      return this.menuItemRepo.find({
        where: { is_deleted: false, is_available: true },
        relations: ['category'],
        take: limit,
        order: { name: 'ASC' },
      });
    } catch (error) {
      this.logger.error('GET_RECOMMENDATIONS_ERROR: ', error);
      throw error;
    }
  }

  private async getPersonalizedRecommendations(
    userId: string,
    limit: number,
  ): Promise<MenuItem[]> {
    // Get the user's most-ordered category IDs from delivered orders
    const topCategories = await this.orderItemRepo
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .innerJoin('oi.menu_item', 'mi')
      .select('mi.category_id', 'category_id')
      .addSelect('SUM(oi.quantity)', 'total_qty')
      .where('o.user_id = :userId', { userId })
      .andWhere('o.status = :status', { status: OrderStatus.DELIVERED })
      .andWhere('o.is_deleted = false')
      .groupBy('mi.category_id')
      .orderBy('"total_qty"', 'DESC')
      .limit(3)
      .getRawMany();

    if (topCategories.length === 0) return [];

    const categoryIds = topCategories.map((c) => c.category_id);

    // Get the menu_item_ids the user has already ordered
    const orderedItemIds = await this.orderItemRepo
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .select('DISTINCT oi.menu_item_id', 'menu_item_id')
      .where('o.user_id = :userId', { userId })
      .andWhere('o.is_deleted = false')
      .getRawMany();

    const excludeIds = orderedItemIds.map((r) => r.menu_item_id);

    // Find items in those categories that user hasn't ordered
    const qb = this.menuItemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .where('item.is_deleted = false')
      .andWhere('item.is_available = true')
      .andWhere('item.category_id IN (:...categoryIds)', { categoryIds });

    if (excludeIds.length > 0) {
      qb.andWhere('item.id NOT IN (:...excludeIds)', { excludeIds });
    }

    return qb.take(limit).getMany();
  }

  private async getPopularItems(limit: number): Promise<MenuItem[]> {
    const popular = await this.orderItemRepo
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .select('oi.menu_item_id', 'menu_item_id')
      .addSelect('SUM(oi.quantity)', 'total_qty')
      .where('o.is_deleted = false')
      .groupBy('oi.menu_item_id')
      .orderBy('"total_qty"', 'DESC')
      .limit(limit)
      .getRawMany();

    if (popular.length === 0) return [];

    const ids = popular.map((p) => p.menu_item_id);

    return this.menuItemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .where('item.id IN (:...ids)', { ids })
      .andWhere('item.is_deleted = false')
      .andWhere('item.is_available = true')
      .getMany();
  }
}
