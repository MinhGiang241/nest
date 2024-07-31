import { IsEmail, IsString } from 'class-validator';
import { I18nContext, i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('common.invalid_email'),
    },
  )
  email: string;

  @IsString({
    message: i18nValidationMessage('common.string_pass'),
  })
  password: string;
}

export class UpdateUserDto {
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('common.invalid_email'),
    },
  )
  email: string;
  @IsString({
    message: i18nValidationMessage('common.string_pass'),
  })
  password: string;
}
