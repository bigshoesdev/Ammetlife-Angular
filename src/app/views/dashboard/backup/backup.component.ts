import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-backup',
    templateUrl: './backup.component.html',
    styles: []
})

export class BackupComponent implements OnInit {
    page: number = 1;
    total: number;

    perPage = new FormControl(15);
    funds: any;

    loading: boolean = false;

    /**
     * Class constructor
     * 
     * @param router
     * @param DS 
     */
    constructor(private router: Router, private DS: DashboardService) { }

    /**
     * Loads current page data
     * 
     * @param page 
     */
    getPage(page: number) {
        var params = {
            offset: page - 1,
            per_page: this.perPage.value
        };

        this.loading = true;

        this.DS.getAllDailyFundsBackup(params)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(
                (res: any) => {
                    this.funds = res.items;
                    this.total = res.total;
                    this.page = page;
                },
                () => {
                    this.router.navigate(['/dashboard']);
                }
            )
    }

    /**
     * Values changes callback
     */
    onChange() {
        this.perPage.valueChanges.subscribe(() => this.getPage(this.page));
    }

    /**
     * OnInit callback
     */
    ngOnInit() {
        this.getPage(1);
        this.onChange();
    }
}
