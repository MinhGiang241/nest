import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
// const cookieSession = require('cookie-session');
import secureSession from '@fastify/secure-session';
import { promisify } from 'util';
import { ValidationError } from '@nestjs/common';

const scrypt = promisify(_scrypt);

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // const salt = randomBytes(8).toString('hex');
  // const secret = (await scrypt('helloworld', salt, 32)) as Buffer;
  //
  // await app.register(secureSession, {
  //   secret,
  //   salt,
  // });

  app.setGlobalPrefix('api', { exclude: ['/view'] }); // lỗi i18n nếu thêm { exclude: ['/'] }

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

  // app.useGlobalPipes(new I18nValidationPipe({ whitelist: true }));
  // Áp dụng Exception Filter cho toàn bộ ứng dụng
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
      // errorFormatter: (errors: ValidationError[]) =>
      //   errors?.map((e) => Object.values(e.constraints)),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(3000);
}
bootstrap();
