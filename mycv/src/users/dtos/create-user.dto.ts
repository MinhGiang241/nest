import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: 'Không phải email hợp lệ',
    },
  )
  email: string;

  @IsString()
  password: string;
}
