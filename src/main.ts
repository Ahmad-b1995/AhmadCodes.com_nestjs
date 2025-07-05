import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Log all environment variables BEFORE creating the app
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
  console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
  console.log('CORS_CREDENTIALS:', process.env.CORS_CREDENTIALS);
  console.log('==============================');
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Configure CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const corsCredentials = configService.get<string>('CORS_CREDENTIALS') === 'true';
  
  // Parse CORS origins (can be comma-separated)
  let origins: string[] | boolean = true; // Default to allow all origins
  if (corsOrigin) {
    if (corsOrigin === '*') {
      origins = true;
    } else {
      origins = corsOrigin.split(',').map(origin => origin.trim());
    }
  }
  
  app.enableCors({
    origin: origins,
    credentials: corsCredentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
  });
  
  console.log('=== CORS CONFIGURATION ===');
  console.log('Origins:', origins);
  console.log('Credentials:', corsCredentials);
  console.log('==========================');
  
  const port = configService.get<number>('APP_PORT') || 3000;

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
