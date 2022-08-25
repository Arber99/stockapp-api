import { Injectable } from '@nestjs/common';
import { MarketService } from 'src/market/market.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockDto } from './dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService, private market: MarketService) {}

  async createStock(userId: number, dto: CreateStockDto) {
    let stockId = 0;
    const entry = await this.prisma.stock.findFirst({
      where: {
        userId,
        ticker: dto.ticker,
      },
    });

    if (entry !== null) {
      stockId = entry.id;
    }

    const price = this.market
      .getMarket()
      .find((element) => element.ticker === dto.ticker).ap;

    const cash = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        cash: { decrement: price * dto.amount },
      },
    });

    const stock = await this.prisma.stock.upsert({
      where: {
        id: stockId,
      },
      update: {
        amount: { increment: dto.amount },
      },
      create: {
        userId,
        ...dto,
      },
    });

    return stock;
  }

  async getStocks(userId: number) {
    const stocks = await this.prisma.stock.findMany({
      where: {
        userId,
      },
    });
    return stocks;
  }
}
