import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/common/types/order.types';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
