import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { errorMessage } from '../../common/utils/error.message';
import { responseMessage } from '../../common/utils/response.message';
import {
  OrderStatus,
  ORDER_STATUS_FLOW,
} from '../../common/types/order.types';
import { CustomLogger } from '../../common/logger';
import { OfferService } from '../offer/offer.service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class OrderService {
  private statusSubjects = new Map<string, Subject<MessageEvent>>();

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    private readonly dataSource: DataSource,
    private readonly logger: CustomLogger,
    private readonly offerService: OfferService,
  ) {}

  async placeOrder(userId: string, dto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.cartRepo.findOne({
        where: { user_id: userId },
        relations: ['items', 'items.menu_item'],
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new BadRequestException(errorMessage.CART.EMPTY);
      }

      // Generate order number atomically
      const seqResult = await queryRunner.query(
        `SELECT nextval('order_number_seq') AS seq`,
      );
      const seq = seqResult[0].seq;
      const orderNumber = `ORD-${String(seq).padStart(4, '0')}`;

      // Calculate total
      const subtotal = cart.items.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0,
      );

      // Apply coupon if provided
      let discountAmount = 0;
      let couponCode: string | undefined;

      if (dto.coupon_code) {
        const offer = await this.offerService.validateCoupon(
          dto.coupon_code,
          subtotal,
          userId,
        );
        discountAmount = this.offerService.calculateDiscount(offer, subtotal);
        couponCode = offer.coupon_code;
      }

      const totalAmount = Number((subtotal - discountAmount).toFixed(2));

      // Create order
      const order = queryRunner.manager.create(Order, {
        order_number: orderNumber,
        user_id: userId,
        status: OrderStatus.PLACED,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        coupon_code: couponCode,
        address_line1: dto.address_line1,
        address_line2: dto.address_line2,
        city: dto.city,
        state: dto.state,
        postal_code: dto.postal_code,
        country: dto.country,
        notes: dto.notes,
        estimated_delivery_at: new Date(Date.now() + 45 * 60 * 1000), // 45 min
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      // Create order items from cart items
      const orderItems = cart.items.map((cartItem) =>
        queryRunner.manager.create(OrderItem, {
          order_id: savedOrder.id,
          menu_item_id: cartItem.menu_item_id,
          quantity: cartItem.quantity,
          unit_price: cartItem.unit_price,
          subtotal: Number(
            (Number(cartItem.unit_price) * cartItem.quantity).toFixed(2),
          ),
        }),
      );

      await queryRunner.manager.save(OrderItem, orderItems);

      // Clear cart
      await queryRunner.manager.delete(CartItem, { cart_id: cart.id });

      await queryRunner.commitTransaction();

      return {
        message: responseMessage.ORDER.PLACED,
        order: {
          id: savedOrder.id,
          order_number: orderNumber,
          status: savedOrder.status,
          total_amount: savedOrder.total_amount,
          discount_amount: savedOrder.discount_amount,
          coupon_code: savedOrder.coupon_code,
          estimated_delivery_at: savedOrder.estimated_delivery_at,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('PLACE_ORDER_ERROR: ', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrders(userId: string, page = 1, limit = 10) {
    try {
      const [orders, total] = await this.orderRepo.findAndCount({
        where: { user_id: userId, is_deleted: false },
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        select: [
          'id',
          'order_number',
          'status',
          'total_amount',
          'created_at',
          'estimated_delivery_at',
        ],
      });

      return {
        orders,
        meta: {
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('GET_ORDERS_ERROR: ', error);
      throw error;
    }
  }

  async getOrder(userId: string, orderId: string) {
    try {
      const order = await this.orderRepo.findOne({
        where: { id: orderId, user_id: userId, is_deleted: false },
        relations: ['items', 'items.menu_item'],
      });

      if (!order) {
        throw new NotFoundException(errorMessage.ORDER.NOT_FOUND);
      }

      return order;
    } catch (error) {
      this.logger.error('GET_ORDER_ERROR: ', error);
      throw error;
    }
  }

  async updateStatus(userId: string, orderId: string, dto: UpdateOrderStatusDto) {
    try {
      const order = await this.orderRepo.findOne({
        where: { id: orderId, user_id: userId, is_deleted: false },
      });

      if (!order) {
        throw new NotFoundException(errorMessage.ORDER.NOT_FOUND);
      }

      if (
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.CANCELLED
      ) {
        throw new BadRequestException(
          order.status === OrderStatus.DELIVERED
            ? errorMessage.ORDER.ALREADY_DELIVERED
            : errorMessage.ORDER.ALREADY_CANCELLED,
        );
      }

      // Validate status transition
      const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
      const newIdx = ORDER_STATUS_FLOW.indexOf(dto.status);

      if (dto.status !== OrderStatus.CANCELLED && newIdx <= currentIdx) {
        throw new BadRequestException(
          errorMessage.ORDER.INVALID_STATUS_TRANSITION,
        );
      }

      order.status = dto.status;

      if (dto.status === OrderStatus.DELIVERED) {
        order.delivered_at = new Date();
      }

      await this.orderRepo.save(order);

      // Notify SSE subscribers
      this.emitStatusUpdate(orderId, order.status);

      return {
        message: responseMessage.ORDER.STATUS_UPDATED,
        status: order.status,
      };
    } catch (error) {
      this.logger.error('UPDATE_ORDER_STATUS_ERROR: ', error);
      throw error;
    }
  }

  async simulateStatusProgression(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, user_id: userId, is_deleted: false },
    });

    if (!order) {
      throw new NotFoundException(errorMessage.ORDER.NOT_FOUND);
    }

    const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
    if (currentIdx < 0 || currentIdx >= ORDER_STATUS_FLOW.length - 1) {
      throw new BadRequestException(
        errorMessage.ORDER.INVALID_STATUS_TRANSITION,
      );
    }

    // Progress through remaining statuses with delays
    const remaining = ORDER_STATUS_FLOW.slice(currentIdx + 1);
    let delay = 0;

    for (const status of remaining) {
      delay += 10000; // 10 seconds between each transition
      setTimeout(async () => {
        try {
          await this.orderRepo.update(
            { id: orderId },
            {
              status,
              ...(status === OrderStatus.DELIVERED
                ? { delivered_at: new Date() }
                : {}),
            },
          );
          this.emitStatusUpdate(orderId, status);
          this.logger.log(
            `Order ${order.order_number} status updated to ${status}`,
          );
        } catch (err) {
          this.logger.error(`Simulation error for order ${orderId}: `, err);
        }
      }, delay);
    }

    return {
      message: responseMessage.ORDER.SIMULATION_STARTED,
      remaining_transitions: remaining,
      interval_seconds: 10,
    };
  }

  // SSE support
  subscribeToStatus(orderId: string): Observable<MessageEvent> {
    if (!this.statusSubjects.has(orderId)) {
      this.statusSubjects.set(orderId, new Subject<MessageEvent>());
    }
    return this.statusSubjects.get(orderId)!.asObservable();
  }

  private emitStatusUpdate(orderId: string, status: OrderStatus) {
    const subject = this.statusSubjects.get(orderId);
    if (subject) {
      subject.next({
        data: { order_id: orderId, status, updated_at: new Date() },
      } as any);
    }
  }

  async repeatOrder(userId: string, orderId: string) {
    // Find the original order and its items
    const originalOrder = await this.orderRepo.findOne({
      where: { id: orderId, user_id: userId, is_deleted: false },
      relations: ['items'],
    });
    if (!originalOrder) {
      throw new NotFoundException(errorMessage.ORDER.NOT_FOUND);
    }

    // Prepare new order data (copy address, but not status, number, etc.)
    const newOrder = this.orderRepo.create({
      user_id: userId,
      status: OrderStatus.PLACED,
      total_amount: originalOrder.total_amount,
      discount_amount: originalOrder.discount_amount,
      coupon_code: originalOrder.coupon_code,
      address_line1: originalOrder.address_line1,
      address_line2: originalOrder.address_line2,
      city: originalOrder.city,
      state: originalOrder.state,
      postal_code: originalOrder.postal_code,
      country: originalOrder.country,
      notes: originalOrder.notes,
      estimated_delivery_at: new Date(Date.now() + 45 * 60 * 1000),
    });
    // Save new order to get ID
    const savedOrder = await this.orderRepo.save(newOrder);

    // Duplicate order items
    const newItems = originalOrder.items.map((item) =>
      this.orderItemRepo.create({
        order_id: savedOrder.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      })
    );
    await this.orderItemRepo.save(newItems);

    return {
      message: 'Order repeated successfully',
      order: savedOrder,
    };
  }
}
