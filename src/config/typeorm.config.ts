import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    entities: [isProduction ? __dirname + '/../**/*.entity.js' : __dirname + '/../**/*.entity.{ts,js}'],
    synchronize: !isProduction,
    ssl: configService.get<string>('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
    extra: {
      connectionTimeoutMillis: configService.get<number>('DATABASE_CONNECTION_TIMEOUT') || 30000,
      idleTimeoutMillis: configService.get<number>('DATABASE_IDLE_TIMEOUT') || 30000,
      max: configService.get<number>('DATABASE_MAX_CONNECTIONS') || 20,
    },
  };
};
