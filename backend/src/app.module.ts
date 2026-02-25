import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from './common/logger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { CONFIG } from './common/constants/config.common';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { OfferModule } from './modules/offer/offer.module';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',

      ...(process.env.DATABASE_URL
        ? {
            url: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {
            host: CONFIG.DB_HOST,
            port: CONFIG.DB_PORT,
            username: CONFIG.DB_USER,
            password: CONFIG.DB_PASSWORD,
            database: CONFIG.DB_NAME,
          }),

      entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      synchronize: false,
    })
    AuthModule,
    MenuModule,
    CartModule,
    OrderModule,
    OfferModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
