import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  I18nValidationPipe,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { APP_PIPE } from '@nestjs/core';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import secureSession from '@fastify/secure-session';

const scrypt = promisify(_scrypt);

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),

    I18nModule.forRootAsync({
      useFactory: (_configService: ConfigService) => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-lang']),
        new CookieResolver(['lang', 'l']),
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new I18nValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  static async registerSecureSession(app) {
    const salt = randomBytes(8).toString('hex');
    const secret = (await scrypt('helloworld', salt, 32)) as Buffer;

    await app.register(secureSession, {
      secret,
      salt,
    });
  }
}
