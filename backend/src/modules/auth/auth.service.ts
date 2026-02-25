import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { errorMessage } from '../../common/utils/error.message';
import { responseMessage } from '../../common/utils/response.message';
import { CONFIG } from '../../common/constants/config.common';
import { CustomLogger } from '../../common/logger';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });

      if (existing) {
        throw new BadRequestException(errorMessage.USER.ALREADY_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(
        dto.password,
        Number(CONFIG.BCRYPT_SALT_ROUNDS) || 10,
      );

      const user = await this.userRepo.save(
        this.userRepo.create({
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          phone_number: dto.phone_number,
          address: dto.address,
        }),
      );

      const token = this.jwtService.sign({
        user_id: user.id,
        email: user.email,
      });

      return {
        message: responseMessage.AUTH.REGISTERED,
        access_token: token,
        user: { id: user.id, name: user.name, email: user.email },
      };
    } catch (error) {
      this.logger.error('REGISTER_ERROR: ', error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: dto.email, is_deleted: false },
        select: { id: true, email: true, name: true, password: true },
      });

      if (!user) {
        throw new BadRequestException(errorMessage.PASSWORD.INVALID_PASSWORD);
      }

      const match = await bcrypt.compare(dto.password, user.password);
      if (!match) {
        throw new BadRequestException(errorMessage.PASSWORD.INVALID_PASSWORD);
      }

      const token = this.jwtService.sign({
        user_id: user.id,
        email: user.email,
      });

      return {
        message: responseMessage.AUTH.LOGGED_IN,
        access_token: token,
        user: { id: user.id, name: user.name, email: user.email },
      };
    } catch (error) {
      this.logger.error('LOGIN_ERROR: ', error);
      throw error;
    }
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId, is_deleted: false },
      select: ['id', 'name', 'email', 'phone_number', 'address'],
    });

    if (!user) {
      throw new BadRequestException(errorMessage.USER.NOT_FOUND);
    }

    return user;
  }
}
