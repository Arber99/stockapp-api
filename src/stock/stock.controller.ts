import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateStockDto } from './dto';
import { StockService } from './stock.service';

@UseGuards(JwtGuard)
@Controller('stocks')
export class StockController {
  constructor(private stockService: StockService) {}
  @Post('buy')
  buyStocks(@GetUser('id') userId: number, @Body() dto: CreateStockDto) {
    return this.stockService.buyStocks(userId, dto);
  }

  @Post('sell')
  sellStocks(@GetUser('id') userId: number, @Body() dto: CreateStockDto) {
    return this.stockService.sellStocks(userId, dto);
  }

  @Get()
  getStocks(@GetUser('id') userId: number) {
    return this.stockService.getStocks(userId);
  }
}
