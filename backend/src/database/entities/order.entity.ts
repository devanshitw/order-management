import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from 'src/common/types/order.types';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  order_number: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PLACED,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  coupon_code?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  delivery_address?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamptz', nullable: true })
  estimated_delivery_at?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  delivered_at?: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
