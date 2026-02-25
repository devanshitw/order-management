import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItem } from 'src/database/entities/menu-item.entity';
import { Category } from 'src/database/entities/category.entity';
import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Category, Order, OrderItem])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
