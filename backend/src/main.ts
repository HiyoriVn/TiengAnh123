import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Thêm <NestExpressApplication> để báo cho TS biết ta dùng Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // CORS config: Chỉ cho phép frontend gọi request
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Cấu hình phục vụ file tĩnh:
  // Mọi file trong thư mục "uploads" sẽ truy cập được qua đường dẫn gốc
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
}
bootstrap();
