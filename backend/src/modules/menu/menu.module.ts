import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { Category } from '../../database/entities/category.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Category, Order, OrderItem])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
