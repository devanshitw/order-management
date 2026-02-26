import { IsString, IsOptional, IsNotEmpty, MaxLength, Length, Matches } from 'class-validator';


export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Address Line 1 is required' })
  @MaxLength(200)
  address_line1: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  address_line2?: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  @MaxLength(100)
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'Postal code is required' })
  @Length(4, 20)
  @Matches(/^[A-Za-z0-9\- ]+$/, { message: 'Invalid postal code format' })
  postal_code: string;

  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  @MaxLength(100)
  country: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  coupon_code?: string;
}
