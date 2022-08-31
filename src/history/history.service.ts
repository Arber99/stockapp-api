import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  getHistory(userId: number) {
    const history = this.prisma.history.findMany({
      where: {
        userId,
      },
    });

    return history;
  }

  async addHistory(userId: number, dto: CreateHistoryDto) {
    const history = await this.prisma.history.create({
      data: {
        userId,
        ...dto,
      },
    });

    return history;
  }
}
