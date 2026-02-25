import { Controller, Get, Param, Query, Req, Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MenuService } from './menu.service';
import { QueryMenuDto } from './dto/query-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('categories')
  async getCategories() {
    return this.menuService.getCategories();
  }

  @Get('recommendations')
  async getRecommendations(
    @Headers('authorization') authHeader?: string,
  ) {
    let userId: string | undefined;

    // Optional auth: extract user_id if token is present
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        if (token) {
          const payload = await this.jwtService.verifyAsync(token);
          userId = payload.user_id;
        }
      } catch {
        // Ignore invalid tokens - treat as unauthenticated
      }
    }

    const items = await this.menuService.getRecommendations(userId);
    return { items };
  }

  @Get()
  async getMenuItems(@Query() query: QueryMenuDto) {
    return this.menuService.getMenuItems(query);
  }

  @Get(':id')
  async getMenuItem(@Param('id') id: string) {
    return this.menuService.getMenuItem(id);
  }
}
