import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async getStatus() {
    return await this.prisma.status
      .findFirst()
      .then((data) => {
        if (data === null) {
          this.prisma.status
            .create({
              data: {
                status: true,
              },
            })
            .then((data) => console.log('Created status with value: ' + data));
        }
      })
      .then(async data => {
        return await this.prisma.status.findFirst();
      });
  }

  async getMarket() {
    return {
      marketData: await this.prisma.currentStock.findMany(),
      marketStatus: (await this.getStatus()).status,
    };
  }
}
