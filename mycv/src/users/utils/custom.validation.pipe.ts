import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class CustomValidationPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    throw new Error('Method not implemented.');
  }
}
