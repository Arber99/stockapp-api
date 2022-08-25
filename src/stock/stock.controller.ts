import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateStockDto } from './dto';
import { StockService } from './stock.service';

@UseGuards(JwtGuard)
@Controller('stocks')
export class StockController {
  constructor(private stockService: StockService) {}
  @Post()
  createStock(@GetUser('id') userId: number, @Body() dto: CreateStockDto) {
    return this.stockService.createStock(userId, dto);
  }

  @Get()
  getStocks(@GetUser('id') userId: number) {
    return this.stockService.getStocks(userId);
  }
}
