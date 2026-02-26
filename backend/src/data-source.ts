import { DataSource } from 'typeorm';
import { CONFIG } from './common/constants/config.common';


const isProduction = process.env.NODE_ENV === 'production';
export const AppDataSource = new DataSource({
  type: 'postgres',

  // 🔥 Use DATABASE_URL in production (Render)
  ...(process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: CONFIG.DB_HOST || 'localhost',
        port: Number(CONFIG.DB_PORT) || 5432,
        username: CONFIG.DB_USER || 'postgres',
        password: CONFIG.DB_PASSWORD || 'root',
        database: CONFIG.DB_NAME || 'food_delivery',
      }),

  entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],

  synchronize: false,
});