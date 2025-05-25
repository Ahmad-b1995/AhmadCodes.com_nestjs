import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3100;

  const config = new DocumentBuilder()
    .setTitle('AhmadCodes.com')
    .setDescription('AhmadCodes.com API description. <a href="/api-json" target="_blank" style="color: #007bff; text-decoration: none;">View/Download Swagger JSON</a>')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { swaggerOptions: { url: '/api-json' } });

  await app.listen(port);
}
bootstrap();
