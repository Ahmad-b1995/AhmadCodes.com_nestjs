import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Log all environment variables at startup
  console.log('=== ENVIRONMENT VARIABLES ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('APP_PORT:', process.env.APP_PORT);
  console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
  console.log('DATABASE_PORT:', process.env.DATABASE_PORT);
  console.log('POSTGRES_DB:', process.env.POSTGRES_DB);
  console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
  console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD ? '***HIDDEN***' : 'NOT SET');
  console.log('DATABASE_SSL:', process.env.DATABASE_SSL);
  console.log('DATABASE_CONNECTION_TIMEOUT:', process.env.DATABASE_CONNECTION_TIMEOUT);
  console.log('DATABASE_IDLE_TIMEOUT:', process.env.DATABASE_IDLE_TIMEOUT);
  console.log('DATABASE_MAX_CONNECTIONS:', process.env.DATABASE_MAX_CONNECTIONS);
  console.log('==============================');
  
  const port = configService.get<number>('APP_PORT') || 3100;

  const config = new DocumentBuilder()
    .setTitle('AhmadCodes.com')
    .setDescription('AhmadCodes.com API description. <a href="/api-json" target="_blank" style="color: #007bff; text-decoration: none;">View/Download Swagger JSON</a>')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { swaggerOptions: { url: '/api-json' } });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
