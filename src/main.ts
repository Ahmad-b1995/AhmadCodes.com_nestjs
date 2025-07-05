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
  
  // Add comprehensive request logging middleware
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const origin = req.headers.origin;
    const userAgent = req.headers['user-agent'];
    const referer = req.headers.referer;
    
    console.log(`\n=== INCOMING REQUEST [${timestamp}] ===`);
    console.log(`Method: ${method}`);
    console.log(`URL: ${url}`);
    console.log(`Origin: ${origin || 'NO ORIGIN'}`);
    console.log(`User-Agent: ${userAgent || 'NO USER AGENT'}`);
    console.log(`Referer: ${referer || 'NO REFERER'}`);
    console.log(`Host: ${req.headers.host || 'NO HOST'}`);
    
    // Log all headers for debugging
    console.log('Headers:');
    Object.keys(req.headers).forEach(key => {
      console.log(`  ${key}: ${req.headers[key]}`);
    });
    
    // Special logging for OPTIONS (preflight) requests
    if (method === 'OPTIONS') {
      console.log('🚨 PREFLIGHT OPTIONS REQUEST DETECTED');
      console.log(`Access-Control-Request-Method: ${req.headers['access-control-request-method'] || 'NOT SET'}`);
      console.log(`Access-Control-Request-Headers: ${req.headers['access-control-request-headers'] || 'NOT SET'}`);
    }
    
    console.log('===============================\n');
    
    // Log response headers after they're set
    const originalSend = res.send;
    res.send = function(body) {
      console.log(`\n=== RESPONSE [${timestamp}] ===`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Method: ${method} ${url}`);
      console.log(`Origin: ${origin || 'NO ORIGIN'}`);
      console.log('Response Headers:');
      Object.keys(res.getHeaders()).forEach(key => {
        console.log(`  ${key}: ${res.getHeaders()[key]}`);
      });
      console.log('============================\n');
      
      return originalSend.call(this, body);
    };
    
    next();
  });
  
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
  
  // Enhanced CORS configuration for bolt.new compatibility
  app.enableCors({
    origin: (origin, callback) => {
      console.log(`\n🔍 CORS Origin Check: "${origin}"`);
      
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        console.log('✅ CORS: Allowing request with no origin');
        return callback(null, true);
      }
      
      // If origins is true, allow all
      if (origins === true) {
        console.log('✅ CORS: Allowing all origins (origins=true)');
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (Array.isArray(origins)) {
        // Special handling for bolt.new variations
        if (origin.includes('bolt.new') || origin.includes('stackblitz.com')) {
          console.log('✅ CORS: Allowing bolt.new/stackblitz origin');
          return callback(null, true);
        }
        
        if (origins.includes(origin)) {
          console.log('✅ CORS: Origin found in allowed list');
          return callback(null, true);
        }
        
        // Log rejected origins for debugging
        console.log(`❌ CORS: Rejected origin: ${origin}`);
        console.log('Allowed origins:', origins);
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
      
      console.log('✅ CORS: Default allow');
      return callback(null, true);
    },
    credentials: corsCredentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'X-Requested-With',
      'Origin',
      'X-Auth-Token',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Cache-Control',
      'Pragma'
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'Authorization'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
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
