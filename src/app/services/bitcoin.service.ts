import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError, of } from 'rxjs';
import { ChartData } from '../models/chart';

const ENTITY = 'coins'

@Injectable({
  providedIn: 'root'
})
export class BitcoinService {

  constructor(private http: HttpClient) {
    const coins = JSON.parse(localStorage.getItem(ENTITY) || 'null')
  }

  getRate(coins: number): Observable<string> {
    const apiUrl = `https://blockchain.info/tobtc?currency=USD&value=${coins}`
    console.log('API URL:', apiUrl)
    return this.http.get<number>(apiUrl).pipe(
      tap((res) => console.log('API Response:', res)),
      map((res: number) => {
        if (res !== null && !isNaN(res)) {
          return res.toString()
        } else {
          throw new Error('Invalid API Response: Unexpected structure or empty response')
        }
      }),
      catchError(this._handleError)
    )
  }

  private saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private getFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  

  getTradeVolume(): Observable<ChartData> {
    const cachedData = this.getFromLocalStorage('tradeVolumeData');
    if (cachedData) {
      return of(cachedData);
    } else {
      const apiUrl = 'https://api.blockchain.info/charts/trade-volume?timespan=5months&format=json&cors=true'
      return this.http.get<ChartData>(apiUrl).pipe(
        map((res: ChartData) => {
          this.saveToLocalStorage('tradeVolumeData', res)
          return res
        }),
        catchError(this._handleError)
      )
    }
  }

  getAvgBlockSize(): Observable<ChartData> {
    const cachedData = this.getFromLocalStorage('avgBlockSizeData')
    if (cachedData) {
      return of(cachedData)
    } else {
      const apiUrl = 'https://api.blockchain.info/charts/avg-block-size?timespan=5months&format=json&cors=true'
      return this.http.get<ChartData>(apiUrl).pipe(
        map((res: ChartData) => {
          this.saveToLocalStorage('avgBlockSizeData', res)
          return res;
        }),
        catchError(this._handleError)
      )
    }
  }

  getMarketPrice(): Observable<ChartData> {
    const cachedData = this.getFromLocalStorage('marketPriceData')
    if (cachedData) {
      return of(cachedData);
    } else {
      const apiUrl = 'https://api.blockchain.info/charts/market-price?timespan=5months&format=json&cors=true'
      return this.http.get<ChartData>(apiUrl).pipe(
        map((res: ChartData) => {
          this.saveToLocalStorage('marketPriceData', res)
          return res;
        }),
        catchError(this._handleError)
      )
    }
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('err:', err)
    return throwError(() => err)
  }
}
