import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @IsString({ message: 'Phải nhập giá trị text' })
  content?: string;
}
