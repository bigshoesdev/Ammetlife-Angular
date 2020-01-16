import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';

// Import Services
import { UrlService } from './url.service';

@Injectable({
    providedIn: 'root'
})

export class FundsService {
    /**
     * Class constructor
     * 
     * @param http 
     * @param url 
     */
    constructor(private http: HttpClient, private url: UrlService) { }

    /**
     * Handles Observable error
     * @param error
     */
    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(error.message || error);
        return throwError(error.message || error);
    }

    /**
     * Dailly funds callback
     */
    getDailyFunds(): Observable<any> {
        return this.http
            .get(this.url.get('dailyfunds'))
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    return {
                        date: moment(res.date).format('DD MMMM YYYY'),
                        funds: res.funds.map((data: any) => {
                            return {
                                id: data.fund_id,
                                name: data.name,
                                price: parseFloat(data.price).toFixed(4)
                            }
                        }),
                    };
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Fund details callback
     * @param fund_id 
     */
    getFundDetails(fund_id: any): Observable<any> {
        return this.http
            .get(this.url.get('fund', fund_id))
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    if (res) {
                        return {
                            max_date: res.max_date,
                            min_date: res.min_date,
                            name: res.name,
                            id: res.id,
                            description: res.description,
                            as_at: moment(res.as_at).format('DD MMMM YYYY'),
                            price: parseFloat(res.price).toFixed(4),
                            price_change: parseFloat(res.price_change) > 0 ? '+' + parseFloat(res.price_change).toFixed(4) : parseFloat(res.price_change).toFixed(4),
                            map: res.map.map((map: any) => [moment.utc(map.as_at).valueOf(), parseFloat(parseFloat(map.price).toFixed(4))]),
                        }
                    } else {
                        return false;
                    }
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Funds list callback
     */
    getFundList(): Observable<any> {
        return this.http
            .get(this.url.get('fundslist'))
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    return res.map((data: any) => {
                        return {
                            id: data.id,
                            name: data.name,
                        };
                    })
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Chart Data Callback
     * @param filter
     */
    getChartData(filter: any): Observable<any> {
        return this.http
            .post(this.url.get('chartdata'), filter)
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    if (res == null) {
                        return res;
                    } else {
                        return res.map((map: any) => [moment.utc(map.as_at).valueOf(), parseFloat(parseFloat(map.price).toFixed(4))]);
                    }
                }),
                catchError(this.handleErrorObservable)
            );
    }
}      