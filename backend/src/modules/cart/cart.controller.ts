import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AuthGuard, AuthenticatedRequest } from '../auth/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  async addItem(
    @Req() req: AuthenticatedRequest,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Patch('items/:id')
  async updateItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, id, dto);
  }

  @Delete('items/:id')
  async removeItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.cartService.removeItem(req.user.id, id);
  }

  @Delete()
  async clearCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.user.id);
  }
}
