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
    .setDescription(`
      ## AhmadCodes.com Backend API
      
      This API provides endpoints for managing articles, user authentication, and user management.
      
      ### Features
      - **Authentication**: JWT-based authentication system
      - **User Management**: Role-based access control (Admin, Editor, User)
      - **Article Management**: CRUD operations for articles
      - **Permission System**: Fine-grained permissions for different operations
      
      ### Getting Started
      1. Register a new account or use the default admin credentials
      2. Login to receive a JWT token
      3. Include the token in the Authorization header: \`Bearer <token>\`
      
      ### Default Admin Credentials
      - Email: \`admin@example.com\`
      - Password: \`admin123\`
      
      **Note**: Change these credentials in production!
    `)
    .setVersion('1.0.0')
    .setContact(
      'Ahmad Codes',
      'https://ahmadcodes.com',
      'contact@ahmadcodes.com'
    )
    .setLicense(
      'MIT',
      'https://opensource.org/licenses/MIT'
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
