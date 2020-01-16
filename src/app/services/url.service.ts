import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class UrlService {
    // define private variables
    private urls: any;
    private base: string = `${environment.api}`

    /**
     * Class constructor
     */
    constructor() {
        this.urls = {
            'login': 'auth/login',
            'user': 'auth/user',
            'updateuser': 'auth/update',
            'upload': 'upload-funds',
            'dailyfunds': 'daily-funds',
            'updatedailyfund': 'update-daily-fund',
            'fundslist': 'funds-list',
            'fund': 'fund-details',
            'chartdata': 'chart-data',
            'alldailyfunds': 'all-daily-funds',
            'alldailyfundsbackup': 'all-daily-funds-backup',
            'allfunds': 'all-funds',
            'updatefund': 'update-fund',
            'statuschange': 'update-status',
            'deletedailyfund': 'delete-daily-fund'
        };
    }

    /**
     * Returns api path 
     * 
     * @param slug
     * @param param 
     */
    get(slug: string = '', param?: any) {
        var url = this.base;
        var join = '/';

        // return base url if slug is empty
        if (slug == '') return url;

        // Check slug is valid or not
        if (slug in this.urls) {
            url += join + this.urls[slug];
            // if any paramater is passed then append on last
            if (param) {
                url += join + param;
            }
        }

        return url;
    }
}
