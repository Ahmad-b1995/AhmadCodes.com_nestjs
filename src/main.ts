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
  
  // Enhanced Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('AhmadCodes.com API')
    .setVersion('1.0.0')
    .setContact(
      'Ahmad Codes',
      'https://ahmadcodes.com',
      'contact@ahmadcodes.com'
    )
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.ahmadcodes.com', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('Authentication', 'Authentication and user management endpoints')
    .addTag('Users', 'User management operations (Admin/Editor only)')
    .addTag('Articles', 'Article management operations')
    .addTag('Health', 'Application health check endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'AhmadCodes.com API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .info .description { color: #34495e; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
    `,
  });

  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap();
