import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { find } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Market } from './dto';

@Injectable()
export class MarketService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async cronMarketData() {
    await this.getMarketData();
    await this.prisma.status.update({
      where: {
        status: false,
      },
      data: {
        status: true,
      },
    });
  }

  async closeMarket() {
    await this.prisma.status.update({
      where: {
        status: true,
      },
      data: {
        status: false,
      },
    });
  }

  getMarketData() {
    return this.httpService.axiosRef
      .get('https://data.alpaca.markets/v2/stocks/quotes/latest', {
        headers: {
          'Content-Type': 'application/json',
          'APCA-API-KEY-ID': this.config.get('ALPACA_KEY'),
          'APCA-API-SECRET-KEY': this.config.get('ALPACA_SECRET'),
        },
        params: {
          symbols:
            'aapl,msft,goog,amzn,tsla,unh,tsm,jnj,v,meta,nvda,xom,wmt,pg,jpm,ma,hd,cvx,lly,ko,bac,pfe,pep,abbv,nvo,cost,baba,mrk,tmo,asml,avgo,tm,bhp,dis,dhr,azn,orcl,shel,csco,acn,adbe,mcd,abt,nvs,vz,tmus,ups,crm,nke,nee,wfc,cmcsa,qcom,txn,bmy,pm,ms,amd,unp,lin,tte,intc,schw,cop,ptr,ry,rtx,hon,cvs,low,amgn,t,hsbc,eqnr,intu,spgi,amt,bx',
        },
      })
      .then((market) => {
        const marketList = [];
        for (const [key, value] of Object.entries(market.data.quotes)) {
          marketList.push({
            ticker: key,
            ap: value['ap'],
            bp: value['bp'],
          });
        }
        marketList.sort((a, b) => (a.ticker > b.ticker ? 1 : -1));
        marketList.forEach((element) => {
          this.setMarket(element);
        });
      });
  }

  async getMarket() {
    return {
      marketData: await this.prisma.currentStock.findMany(),
      marketStatus: await this.getStatus(),
    };
  }

  async getStatus() {
    return await this.prisma.status.findFirst();
  }

  async setMarket(market: Market) {
    const marketList = await this.prisma.currentStock.upsert({
      where: {
        ticker: market.ticker,
      },
      update: {
        bp: market.bp,
        ap: market.ap,
      },
      create: {
        ticker: market.ticker,
        bp: market.bp,
        ap: market.ap,
      },
    });
    return marketList;
  }
}
