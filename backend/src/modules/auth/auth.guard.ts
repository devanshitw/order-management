import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { errorMessage } from '../../common/utils/error.message';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: User;
}

interface JWTPayload {
  user_id: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(errorMessage.TOKEN.NOT_FOUND);
    }

    let payload: JWTPayload;

    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException(errorMessage.TOKEN.INVALID_TOKEN);
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.user_id, is_deleted: false },
      select: ['id', 'email', 'name'],
    });

    if (!user) {
      throw new UnauthorizedException(errorMessage.USER.NOT_FOUND);
    }

    request.user = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}
