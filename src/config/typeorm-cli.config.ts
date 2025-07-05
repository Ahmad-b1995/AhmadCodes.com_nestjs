import { DataSource } from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [isProduction ? __dirname + '/../**/*.entity.js' : __dirname + '/../**/*.entity.{ts,js}'],
  migrations: [isProduction ? __dirname + '/../migrations/*.js' : __dirname + '/../migrations/*.{ts,js}'],
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  logging: ['error', 'warn', 'migration'],
  extra: {
    connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '30000'),
    idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000'),
    max: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
  },
}); 