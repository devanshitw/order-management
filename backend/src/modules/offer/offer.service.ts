import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Offer } from '../../database/entities/offer.entity';
import { DiscountType } from '../../common/types/offer.types';
import { OrderStatus } from '../../common/types/order.types';
import { errorMessage } from '../../common/utils/error.message';
import { CustomLogger } from '../../common/logger';
import { Order } from '../../database/entities/order.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    private readonly logger: CustomLogger,
  ) {}

  async getActiveOffers() {
    try {
      const now = new Date();
      return this.offerRepo.find({
        where: {
          is_active: true,
          is_deleted: false,
          valid_from: LessThanOrEqual(now),
          valid_until: MoreThanOrEqual(now),
        },
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      this.logger.error('GET_ACTIVE_OFFERS_ERROR: ', error);
      throw error;
    }
  }

  async validateCoupon(code: string, orderAmount: number, userId?: string): Promise<Offer> {
    try {
      const now = new Date();
      const offer = await this.offerRepo.findOne({
        where: {
          coupon_code: code.toUpperCase(),
          is_active: true,
          is_deleted: false,
          valid_from: LessThanOrEqual(now),
          valid_until: MoreThanOrEqual(now),
        },
      });

      if (!offer) {
        throw new BadRequestException(errorMessage.OFFER.INVALID_COUPON);
      }

      if (orderAmount < Number(offer.min_order_amount)) {
        throw new BadRequestException(
          `${errorMessage.OFFER.MIN_ORDER_NOT_MET} ₹${offer.min_order_amount}`,
        );
      }

      // Example: If coupon is for new users only, prevent use if user has previous completed orders
      if (userId && offer.title && offer.title.toLowerCase().includes('new user')) {
        const previousOrder = await this.offerRepo.manager.findOne(Order, {
          where: { user_id: userId, status: OrderStatus.DELIVERED },
        });
        if (previousOrder) {
          throw new BadRequestException('This coupon is only valid for new users (first order).');
        }
      }

      return offer;
    } catch (error) {
      this.logger.error('VALIDATE_COUPON_ERROR: ', error);
      throw error;
    }
  }

  calculateDiscount(offer: Offer, amount: number): number {
    let discount: number;

    if (offer.discount_type === DiscountType.PERCENTAGE) {
      discount = (amount * Number(offer.discount_value)) / 100;
    } else {
      discount = Number(offer.discount_value);
    }

    // Cap discount at order total
    return Math.min(Number(discount.toFixed(2)), amount);
  }
}
