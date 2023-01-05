import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChartService {
  constructor(private prisma: PrismaService) {}

  async getChart() {
    return await this.prisma.dailyChart.findMany();
  }
}
