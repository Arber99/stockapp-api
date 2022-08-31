import { Module } from '@nestjs/common';
import { HistoryService } from 'src/history/history.service';
import { MarketModule } from 'src/market/market.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [MarketModule],
  controllers: [StockController],
  providers: [StockService, HistoryService],
})
export class StockModule {}
