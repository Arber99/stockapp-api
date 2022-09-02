import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ChartService } from 'src/chart/chart.service';
import { MarketService } from 'src/market/market.service';

@Injectable()
export class CronService {
  constructor(
    private marketService: MarketService,
    private chartService: ChartService,
  ) {}

  @Cron('15 30/1 15 * * 1-5')
  marketHalf() {
    this.marketService.cronMarketData();
  }

  @Cron('15 */1 16-21 * * 1-5')
  marketFull() {
    this.marketService.cronMarketData();
  }

  @Cron('30 45/15 15 * * 1-5')
  chartQuarter() {
    const start = new Date(Date.now());
    start.setHours(15);
    start.setMinutes(30);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = new Date(Date.now() - 910000);
    this.chartService.cronMarketData(start.toISOString(), end.toISOString());
  }

  @Cron('30 */15 16-21 * * 1-5')
  chartFull() {
    const start = new Date(Date.now());
    start.setHours(15);
    start.setMinutes(30);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = new Date(Date.now() - 910000);
    this.chartService.cronMarketData(start.toISOString(), end.toISOString());
  }

  @Cron('30 0-15/15 22 * * 1-5')
  chartFinal() {
    const start = new Date(Date.now());
    start.setHours(15);
    start.setMinutes(30);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = new Date(Date.now() - 910000);
    this.chartService.cronMarketData(start.toISOString(), end.toISOString());
  }

  @Cron('0 0 22 * * *')
  closeMarket() {
    this.marketService.status = false;
  }
}
