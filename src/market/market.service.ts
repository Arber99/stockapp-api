import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Market } from './dto';

@Injectable()
export class MarketService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  market: Market[];

  @Cron('0 * * * * *')
  async handleCron() {
    await this.getMarketData();
    console.log(this.market);
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
        this.setMarket(
          marketList.sort((a, b) => (a.ticker > b.ticker ? 1 : -1)),
        );
      });
  }

  getMarket() {
    return this.market;
  }

  setMarket(market) {
    this.market = market;
  }
}
