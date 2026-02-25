import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from './category.entity';

@Entity('menu_items')
export class MenuItem extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', nullable: true })
  image_url?: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => Category, (cat) => cat.menu_items)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ default: true })
  is_available: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'int', nullable: true })
  preparation_time_minutes?: number;
}
