import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { MenuItem } from 'src/database/entities/menu-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { errorMessage } from 'src/common/utils/error.message';
import { CustomLogger } from 'src/common/logger';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
    private readonly logger: CustomLogger,
  ) {}

  private async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await this.cartRepo.save(
        this.cartRepo.create({ user_id: userId }),
      );
    }

    return cart;
  }

  async getCart(userId: string) {
    try {
      const cart = await this.getOrCreateCart(userId);

      const cartWithItems = await this.cartRepo.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.menu_item'],
      });

      const items = cartWithItems?.items || [];
      const total_amount = items.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0,
      );

      return {
        id: cart.id,
        items,
        total_amount: Number(total_amount.toFixed(2)),
        item_count: items.length,
      };
    } catch (error) {
      this.logger.error('GET_CART_ERROR: ', error);
      throw error;
    }
  }

  async addItem(userId: string, dto: AddToCartDto) {
    try {
      const menuItem = await this.menuItemRepo.findOne({
        where: { id: dto.menu_item_id, is_deleted: false, is_available: true },
      });

      if (!menuItem) {
        throw new NotFoundException(errorMessage.MENU.ITEM_NOT_AVAILABLE);
      }

      const cart = await this.getOrCreateCart(userId);

      const existingItem = await this.cartItemRepo.findOne({
        where: { cart_id: cart.id, menu_item_id: dto.menu_item_id },
      });

      if (existingItem) {
        existingItem.quantity += dto.quantity;
        await this.cartItemRepo.save(existingItem);
      } else {
        await this.cartItemRepo.save(
          this.cartItemRepo.create({
            cart_id: cart.id,
            menu_item_id: dto.menu_item_id,
            quantity: dto.quantity,
            unit_price: menuItem.price,
          }),
        );
      }

      return this.getCart(userId);
    } catch (error) {
      this.logger.error('ADD_TO_CART_ERROR: ', error);
      throw error;
    }
  }

  async updateItem(userId: string, cartItemId: string, dto: UpdateCartItemDto) {
    try {
      const cart = await this.getOrCreateCart(userId);

      const cartItem = await this.cartItemRepo.findOne({
        where: { id: cartItemId, cart_id: cart.id },
      });

      if (!cartItem) {
        throw new NotFoundException(errorMessage.CART.ITEM_NOT_FOUND);
      }

      cartItem.quantity = dto.quantity;
      await this.cartItemRepo.save(cartItem);

      return this.getCart(userId);
    } catch (error) {
      this.logger.error('UPDATE_CART_ITEM_ERROR: ', error);
      throw error;
    }
  }

  async removeItem(userId: string, cartItemId: string) {
    try {
      const cart = await this.getOrCreateCart(userId);

      const cartItem = await this.cartItemRepo.findOne({
        where: { id: cartItemId, cart_id: cart.id },
      });

      if (!cartItem) {
        throw new NotFoundException(errorMessage.CART.ITEM_NOT_FOUND);
      }

      await this.cartItemRepo.remove(cartItem);

      return this.getCart(userId);
    } catch (error) {
      this.logger.error('REMOVE_CART_ITEM_ERROR: ', error);
      throw error;
    }
  }

  async clearCart(userId: string) {
    try {
      const cart = await this.getOrCreateCart(userId);

      await this.cartItemRepo.delete({ cart_id: cart.id });

      return { id: cart.id, items: [], total_amount: 0, item_count: 0 };
    } catch (error) {
      this.logger.error('CLEAR_CART_ERROR: ', error);
      throw error;
    }
  }
}
