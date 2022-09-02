import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';

@Module({
  imports: [HttpModule],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
