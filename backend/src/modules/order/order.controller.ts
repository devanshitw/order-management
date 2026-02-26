import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuthGuard, AuthenticatedRequest } from '../auth/auth.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async placeOrder(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.placeOrder(req.user.id, dto);
  }

  @Get()
  async getOrders(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.orderService.getOrders(req.user.id, page, limit);
  }

  @Get(':id')
  async getOrder(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.orderService.getOrder(req.user.id, id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(req.user.id, id, dto);
  }

  @Post(':id/simulate')
  async simulateStatusProgression(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.orderService.simulateStatusProgression(req.user.id, id);
  }

  @Sse(':id/status')
  statusStream(@Param('id') id: string): Observable<MessageEvent> {
    return this.orderService.subscribeToStatus(id);
  }

  @Post(':id/repeat')
  async repeatOrder(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.orderService.repeatOrder(req.user.id, id);
  }
}
