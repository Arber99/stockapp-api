import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async getStatus() {
    return await this.prisma.status.findFirst();
  }

  async getMarket() {
    return {
      marketData: await this.prisma.currentStock.findMany(),
      marketStatus: (await this.prisma.status.findFirst()).status,
    };
  }
}
