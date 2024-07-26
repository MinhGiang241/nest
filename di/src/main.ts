import { NestFactory } from '@nestjs/core';
import { ComputerModule } from './computer/computer.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ComputerModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: ['http://example.com', '*'], // Chỉ định các nguồn gốc được phép
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Chỉ định các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ định các tiêu đề được phép
    credentials: true, // Cho phép gửi thông tin xác thực (cookie, authorization headers)
  });
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      ejs: require('ejs'),
    },
    templates: join(__dirname, '..', 'views'),
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Message example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(5000);
}
bootstrap();
