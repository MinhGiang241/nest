import { Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}

  getHello(): string {
    return this.i18n.translate('common.HELLO', {
      lang: I18nContext.current().lang,
    });
  }
}
