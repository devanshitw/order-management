import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Delivery address is required' })
  @MaxLength(500)
  delivery_address: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  coupon_code?: string;
}
