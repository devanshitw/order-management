import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  menu_item_id: string;

  @IsInt()
  @Min(1)
  @Max(20)
  quantity: number;
}
