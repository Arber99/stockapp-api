import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateHistoryDto } from './dto/create-history.dto';
import { HistoryService } from './history.service';

@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
  constructor(private history: HistoryService) {}

  @Get()
  getHistory(@GetUser('id') userId: number) {
    return this.history.getHistory(userId);
  }

  @Post()
  addHistory(@GetUser('id') userId: number, @Body() dto: CreateHistoryDto) {
    return this.history.addHistory(userId, dto);
  }
}
