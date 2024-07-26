import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { DiskController } from './disk.controller';
import { PowerService } from 'src/power/power.service';
import { PowerModule } from 'src/power/power.module';

@Module({
  imports: [PowerModule],
  providers: [DiskService],
  controllers: [DiskController],
  exports: [DiskService],
})
export class DiskModule {
  constructor(private powerService: PowerService) {}

  getData() {
    console.log('Drawing 20 Watts of power from Powerservice');
    this.powerService.supplyPower(20);
    return 'data!';
  }
}
