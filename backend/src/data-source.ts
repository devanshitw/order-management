export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  synchronize: false,
});