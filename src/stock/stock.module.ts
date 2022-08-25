import { Module } from '@nestjs/common';
import { MarketModule } from 'src/market/market.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [MarketModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
