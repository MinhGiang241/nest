import {
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { STATUS_CODES } from 'http';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  findByEmail(email: string) {
    // return this.repo.find({ where: { email } });
    return this.repo.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'NOT FOUND',
        errors: [
          this.i18n.t('common.user_not_found', {
            lang: I18nContext.current().lang,
          }),
        ],
      });
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async removeById(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'NOT FOUND',
        errors: [
          this.i18n.t('common.user_not_found', {
            lang: I18nContext.current().lang,
          }),
        ],
      });
    }
    return this.repo.remove(user);
  }
}
