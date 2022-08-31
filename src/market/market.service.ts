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

  market: Market[] = [
    { ticker: 'AAPL', ap: 0, bp: 0 },
    { ticker: 'ABBV', ap: 0, bp: 0 },
    { ticker: 'ABT', ap: 0, bp: 0 },
    { ticker: 'ACN', ap: 0, bp: 0 },
    { ticker: 'ADBE', ap: 0, bp: 0 },
    { ticker: 'AMD', ap: 0, bp: 0 },
    { ticker: 'AMGN', ap: 0, bp: 0 },
    { ticker: 'AMT', ap: 0, bp: 0 },
    { ticker: 'AMZN', ap: 0, bp: 0 },
    { ticker: 'ASML', ap: 0, bp: 0 },
    { ticker: 'AVGO', ap: 0, bp: 0 },
    { ticker: 'AZN', ap: 0, bp: 0 },
    { ticker: 'BABA', ap: 0, bp: 0 },
    { ticker: 'BAC', ap: 0, bp: 0 },
    { ticker: 'BHP', ap: 0, bp: 0 },
    { ticker: 'BMY', ap: 0, bp: 0 },
    { ticker: 'BX', ap: 0, bp: 0 },
    { ticker: 'CMCSA', ap: 0, bp: 0 },
    { ticker: 'COP', ap: 0, bp: 0 },
    { ticker: 'COST', ap: 0, bp: 0 },
    { ticker: 'CRM', ap: 0, bp: 0 },
    { ticker: 'CSCO', ap: 0, bp: 0 },
    { ticker: 'CVS', ap: 0, bp: 0 },
    { ticker: 'CVX', ap: 0, bp: 0 },
    { ticker: 'DHR', ap: 0, bp: 0 },
    { ticker: 'DIS', ap: 0, bp: 0 },
    { ticker: 'EQNR', ap: 0, bp: 0 },
    { ticker: 'GOOG', ap: 0, bp: 0 },
    { ticker: 'HD', ap: 0, bp: 0 },
    { ticker: 'HON', ap: 0, bp: 0 },
    { ticker: 'HSBC', ap: 0, bp: 0 },
    { ticker: 'INTC', ap: 0, bp: 0 },
    { ticker: 'INTU', ap: 0, bp: 0 },
    { ticker: 'JNJ', ap: 0, bp: 0 },
    { ticker: 'JPM', ap: 0, bp: 0 },
    { ticker: 'KO', ap: 0, bp: 0 },
    { ticker: 'LIN', ap: 0, bp: 0 },
    { ticker: 'LLY', ap: 0, bp: 0 },
    { ticker: 'LOW', ap: 0, bp: 0 },
    { ticker: 'MA', ap: 0, bp: 0 },
    { ticker: 'MCD', ap: 0, bp: 0 },
    { ticker: 'META', ap: 0, bp: 0 },
    { ticker: 'MRK', ap: 0, bp: 0 },
    { ticker: 'MS', ap: 0, bp: 0 },
    { ticker: 'MSFT', ap: 0, bp: 0 },
    { ticker: 'NEE', ap: 0, bp: 0 },
    { ticker: 'NKE', ap: 0, bp: 0 },
    { ticker: 'NVDA', ap: 0, bp: 0 },
    { ticker: 'NVO', ap: 0, bp: 0 },
    { ticker: 'NVS', ap: 0, bp: 0 },
    { ticker: 'ORCL', ap: 0, bp: 0 },
    { ticker: 'PEP', ap: 0, bp: 0 },
    { ticker: 'PFE', ap: 0, bp: 0 },
    { ticker: 'PG', ap: 0, bp: 0 },
    { ticker: 'PM', ap: 0, bp: 0 },
    { ticker: 'PTR', ap: 0, bp: 0 },
    { ticker: 'QCOM', ap: 0, bp: 0 },
    { ticker: 'RTX', ap: 0, bp: 0 },
    { ticker: 'RY', ap: 0, bp: 0 },
    { ticker: 'SCHW', ap: 0, bp: 0 },
    { ticker: 'SHEL', ap: 0, bp: 0 },
    { ticker: 'SPGI', ap: 0, bp: 0 },
    { ticker: 'T', ap: 0, bp: 0 },
    { ticker: 'TM', ap: 0, bp: 0 },
    { ticker: 'TMO', ap: 0, bp: 0 },
    { ticker: 'TMUS', ap: 0, bp: 0 },
    { ticker: 'TSLA', ap: 0, bp: 0 },
    { ticker: 'TSM', ap: 0, bp: 0 },
    { ticker: 'TTE', ap: 0, bp: 0 },
    { ticker: 'TXN', ap: 0, bp: 0 },
    { ticker: 'UNH', ap: 0, bp: 0 },
    { ticker: 'UNP', ap: 0, bp: 0 },
    { ticker: 'UPS', ap: 0, bp: 0 },
    { ticker: 'V', ap: 0, bp: 0 },
    { ticker: 'VZ', ap: 0, bp: 0 },
    { ticker: 'WFC', ap: 0, bp: 0 },
    { ticker: 'WMT', ap: 0, bp: 0 },
    { ticker: 'XOM', ap: 0, bp: 0 },
  ];
  status = false;

  @Cron('15 */1 16-21 * * *')
  schedule1() {
    this.handleCron();
  }

  @Cron('15 30/1 15 * * *')
  schedule2() {
    this.handleCron();
  }

  @Cron('0 0 22 * * *')
  closeMarket() {
    this.status = false;
  }

  async handleCron() {
    await this.getMarketData();
    this.status = true;
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
    return {
      marketData: this.market,
      marketStatus: this.status,
    };
  }

  getStatus() {
    return this.status;
  }

  setMarket(market) {
    this.market = market;
  }
}
