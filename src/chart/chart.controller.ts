import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ChartService } from './chart.service';

@UseGuards(JwtGuard)
@Controller('chart')
export class ChartController {
  constructor(private chart: ChartService) {}

  @Get()
  async getChart() {
    const chart = await this.chart.getChart();
    return chart;
  }
}
