import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Simple CORS configuration
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';
  const corsCredentials = configService.get<string>('CORS_CREDENTIALS') === 'true';
  
  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(origin => origin.trim()),
    credentials: corsCredentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    exposedHeaders: ['Authorization'],
  });
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('AhmadCodes.com API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
}

bootstrap();
