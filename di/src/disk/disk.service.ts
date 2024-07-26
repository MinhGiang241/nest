import { Injectable } from '@nestjs/common';

@Injectable()
export class DiskService {
  getData() {
    console.log('Get Data from disk');
    return 3;
  }
}
