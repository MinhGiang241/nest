import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.enableCors({
    origin: ['*'], // Chỉ định các nguồn gốc được phép
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Chỉ định các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ định các tiêu đề được phép
    credentials: true, // Cho phép gửi thông tin xác thực (cookie, authorization headers)
  });

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '',
  });
  //  app.setViewEngine({
  //   engine: {
  //     pug: require('pug'),
  //   },
  //   templates: join(__dirname, '..', 'views'),
  // });

  app.useGlobalPipes(new I18nValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new I18nValidationExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Car example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(3000);
}
bootstrap();
