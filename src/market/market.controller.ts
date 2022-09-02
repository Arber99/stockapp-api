import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { MarketService } from './market.service';

@UseGuards(JwtGuard)
@Controller('market')
export class MarketController {
  constructor(private market: MarketService) {}

  @Get()
  async getMarket() {
    return await this.market.getMarket();
  }
}
