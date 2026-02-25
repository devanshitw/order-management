import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../common/types/order.types';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
