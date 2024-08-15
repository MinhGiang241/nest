import { randomBytes, scrypt as _scrypt } from 'crypto';
import secureSession from '@fastify/secure-session';
import { promisify } from 'util';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

const scrypt = promisify(_scrypt);

export const setupApp = async (app: any) => {
  const salt = randomBytes(8).toString('hex');
  const secret = (await scrypt('helloworld', salt, 32)) as Buffer;

  await app.register(secureSession, {
    secret,
    salt,
  });

  app.setGlobalPrefix('api', { exclude: ['/view'] }); // lỗi i18n nếu thêm { exclude: ['/'] }
  app.useGlobalPipes(new I18nValidationPipe({ whitelist: true }));
  // Áp dụng Exception Filter cho toàn bộ ứng dụng
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
};
