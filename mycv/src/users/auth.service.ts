import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scypt } from 'crypto';
import { promisify } from 'util';
import { I18nContext, I18nService } from 'nestjs-i18n';

const scrypt = promisify(_scypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.userService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'BAD_REQUEST',
        errors: [
          this.i18n.t('common.email_in_use', {
            lang: I18nContext.current()?.lang,
          }),
        ],
      });
    }

    // Hash the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join the hashed resultl and salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.userService.create(email, result);

    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'NOT FOUND',
        errors: [
          this.i18n.t('common.user_not_found', {
            lang: I18nContext.current()?.lang,
          }),
        ],
      });
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash != hash.toString('hex')) {
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'NOT FOUND',
        errors: [
          this.i18n.t('common.bad_password', {
            lang: I18nContext.current().lang,
          }),
        ],
      });
    } else {
      return user;
    }
  }
}
