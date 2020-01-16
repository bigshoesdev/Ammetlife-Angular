import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UrlService } from './url.service';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    /**
     * Class constructor
     * @param http 
     * @param url 
     */
    constructor(private http: HttpClient, private url: UrlService) { }

    /**
     * Handles Observable error
     * @param error
     */
    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(error.message || error.error || error);
        return throwError(error.message || error.error || error);
    }

    /**
     * Short the string by words
     * 
     * @param str 
     * @param maxLen 
     * @param separator 
     */
    private shorten(str: string, maxLen: number, separator: any = ' ') {
        var index = this.nthIndex(str, separator, maxLen);
        if (index <= 0 || str.length <= 0) return str;
        if (str.length <= index) return str;
        return str.substr(0, index) + '...';
    }

    /**
     * Finds nth index ot pattern
     * 
     * @param str 
     * @param pat 
     * @param n 
     */
    private nthIndex(str: string, pat: any, n: number) {
        var L = str.length, i = -1;
        while (n-- && i++ < L) {
            i = str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }

    /**
     * Upload funds callback
     * @param uploadData 
     */
    uploadFunds(uploadData: any): Observable<any> {
        return this.http
            .post(this.url.get('upload'), uploadData)
            .pipe(
                map((res: any) => res = res.data),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * All Daily Funds calllback
     * @param params
     */
    getAllDailyFunds(params: any): Observable<any> {
        return this.http
            .post(this.url.get('alldailyfunds'), params)
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    res.items = res.items.map((data: any) => {
                        return {
                            id: data.id,
                            name: data.name,
                            as_at: moment(data.as_at).format('DD MMM YYYY'),
                            price: parseFloat(data.price).toFixed(4),
                            status: data.status
                        }
                    })
                    return res;
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * All Daily Funds Backup calllback
     * @param params
     */
    getAllDailyFundsBackup(params: any): Observable<any> {
        return this.http
            .post(this.url.get('alldailyfundsbackup'), params)
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    res.items = res.items.map((data: any) => {
                        return {
                            id: data.id,
                            name: data.name,
                            as_at: moment(data.as_at).format('DD MMM YYYY'),
                            price: parseFloat(data.price).toFixed(4),
                            status: data.status
                        }
                    })
                    return res;
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
    * All Daily Funds calllback
    * @param params
    */
    getAllFunds(params: any): Observable<any> {
        return this.http
            .post(this.url.get('allfunds'), params)
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    res.items = res.items.map((data: any) => {
                        return {
                            id: data.id,
                            name: data.name,
                            short_desc: this.shorten(data.description, 12),
                            description: data.description,
                            status: data.status,
                        }
                    })
                    return res;
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Update fund details
     * 
     * @param params 
     */
    updateFund(params: any): Observable<any> {
        return this.http
            .post(this.url.get('updatefund'), params)
            .pipe(
                map((res: any) => res = res.data),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Change status for approve and unapprove
     * 
     * @param date 
     * @param status 
     */
    statusChange(date: any, status: number) {
        return this.http
            .post(this.url.get('statuschange'), { date: date, status: status })
            .pipe(
                map((res: any) => res = res.data),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Update daily fund details
     * 
     * @param params 
     */
    updateDailyFund(params: any): Observable<any> {
        return this.http
            .post(this.url.get('updatedailyfund'), params)
            .pipe(
                map((res: any) => res = res.data),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Delete fund
     * 
     * @param date 
     * @param status 
     */
    deleteDailyFund(date: any) {
        return this.http
            .post(this.url.get('deletedailyfund'), { date: date })
            .pipe(
                map((res: any) => res = res.data),
                catchError(this.handleErrorObservable)
            );
    }
}
