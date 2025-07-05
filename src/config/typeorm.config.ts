import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  
  // Log the database configuration being used
  console.log('=== DATABASE CONFIGURATION ===');
  console.log('Production mode:', isProduction);
  console.log('Database host:', configService.get<string>('DATABASE_HOST'));
  console.log('Database port:', configService.get<number>('DATABASE_PORT'));
  console.log('Database name:', configService.get<string>('POSTGRES_DB'));
  console.log('Database user:', configService.get<string>('POSTGRES_USER'));
  console.log('SSL enabled:', configService.get<string>('DATABASE_SSL') === 'true');
  console.log('Connection timeout:', configService.get<number>('DATABASE_CONNECTION_TIMEOUT') || 30000);
  console.log('================================');
  
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    entities: [isProduction ? __dirname + '/../**/*.entity.js' : __dirname + '/../**/*.entity.{ts,js}'],
    migrations: [isProduction ? __dirname + '/../migrations/*.js' : __dirname + '/../migrations/*.{ts,js}'],
    synchronize: !isProduction, // Enable synchronize only for development
    migrationsRun: isProduction, // Auto-run migrations in production
    ssl: configService.get<string>('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
    logging: ['error', 'warn', 'migration'],
    extra: {
      connectionTimeoutMillis: configService.get<number>('DATABASE_CONNECTION_TIMEOUT') || 30000,
      idleTimeoutMillis: configService.get<number>('DATABASE_IDLE_TIMEOUT') || 30000,
      max: configService.get<number>('DATABASE_MAX_CONNECTIONS') || 20,
    },
  };
};
