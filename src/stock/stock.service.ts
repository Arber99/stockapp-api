import { ForbiddenException, Injectable } from '@nestjs/common';
import { HistoryService } from 'src/history/history.service';
import { MarketService } from 'src/market/market.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockDto } from './dto';

@Injectable()
export class StockService {
  constructor(
    private prisma: PrismaService,
    private market: MarketService,
    private history: HistoryService,
  ) {}

  async buyStocks(userId: number, dto: CreateStockDto) {
    if (this.market.getStatus()) {
      if (dto.amount < 1) {
        throw new ForbiddenException('Enter an amount bigger or equal than 1');
      }
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
        .marketData.find((element) => element.ticker === dto.ticker).ap;

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

      this.history.addHistory(userId, {
        ticker: dto.ticker,
        price: price,
        amount: dto.amount,
        type: 'Buy',
      });

      return stock;
    } else {
      throw new ForbiddenException('Cannot buy, the market is closed');
    }
  }

  async sellStocks(userId: number, dto: CreateStockDto) {
    if (this.market.getStatus()) {
      let stockId = 0;
      const entry = await this.prisma.stock.findFirst({
        where: {
          userId,
          ticker: dto.ticker,
        },
      });

      if (entry === null || entry.amount <= dto.amount) {
        throw new ForbiddenException("You can't sell stocks you don't own");
      } else if (dto.amount < 1) {
        throw new ForbiddenException('Enter an amount bigger or equal than 1');
      }
      stockId = entry.id;

      const price = this.market
        .getMarket()
        .marketData.find((element) => element.ticker === dto.ticker).bp;

      const cash = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          cash: { increment: price * dto.amount },
        },
      });

      const stock = await this.prisma.stock.update({
        where: {
          id: stockId,
        },
        data: {
          amount: { decrement: dto.amount },
        },
      });

      this.history.addHistory(userId, {
        ticker: dto.ticker,
        price: price,
        amount: dto.amount,
        type: 'Sell',
      });

      return stock;
    } else {
      throw new ForbiddenException('Cannot sell, the market is closed');
    }
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
