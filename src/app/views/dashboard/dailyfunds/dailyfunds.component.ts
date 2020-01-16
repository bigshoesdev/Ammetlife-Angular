import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DashboardService } from 'src/app/services';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-dailyfunds',
    templateUrl: './dailyfunds.component.html',
})

export class DailyfundsComponent implements OnInit {
    // Define variables
    page: number = 1;
    total: number;

    perPage = new FormControl(15);
    status = new FormControl('');
    date = new FormControl('');

    funds: any;

    editForm: FormGroup;
    editFundID: number;
    error: any = false;
    success: boolean = false;
    submitted: boolean = false;

    modalRef: BsModalRef;
    config = {
        keyboard: false,
        ignoreBackdropClick: true
    };

    // Datepicker Variables
    datepickerConfig: Partial<BsDatepickerConfig>;

    loading: boolean = false;
    /**
     * Class constructor
     * 
     * @param router
     * @param DS 
     */
    constructor(
        private router: Router, 
        private DS: DashboardService,
        private FB: FormBuilder,
        private MS: BsModalService
    ) { }

    /**
     * Sets datepicker config
     */
    setDatepickerConfig() {
        this.datepickerConfig = Object.assign({},
            {
                containerClass: 'theme-dark-blue datepicker-container-wrap',
                showWeekNumbers: false,
                dateInputFormat: 'DD MMM YYYY',
                dateOutputFormat: 'YYYY-MM-DD',
                isAnimated: true,
                adaptivePosition: true,
            }
        );
    }

    /**
     * Loads current page data
     * 
     * @param page 
     */
    getPage(page: number) {
        var date = this.date.value;
        var params = {
            offset: page - 1,
            per_page: this.perPage.value,
            status: this.status.value == '' ? '' : this.status.value.toString(),
            date: date == '' || date == null ? '' : moment(date).format('YYYY-MM-DD'),
        };

        this.loading = true;

        this.DS.getAllDailyFunds(params)
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
        this.date.valueChanges.subscribe(() => this.getPage(1));
        this.status.valueChanges.subscribe(() => this.getPage(1));
        this.perPage.valueChanges.subscribe(() => this.getPage(this.page));
    }

    /**
     * Clears date field
     */
    clearDate() {
        if (this.date.value != '' && this.date.value != null) {
            this.date.reset();
        }
        return;
    }

    /**
     * OnInit callback
     */
    ngOnInit() {
        this.setDatepickerConfig();
        this.getPage(1);
        this.onChange();

        this.editForm = this.FB.group({
            price: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[+-]?([0-9]{1,4}[.])?[0-9]{0,4}$')
            ]))
        });
    }

    /**
     * Returns rowspan
     * 
     * @param date 
     */
    getRowSpan(date: string) {
        return this.funds.filter((obj: any) => obj.as_at === date).length;
    }

    /**
     * Status change callback
     * 
     * @param date 
     * @param status 
     */
    statusChange(date: any, status: number) {
        date = moment(date, 'DD MMM YYYY').format('YYYY-MM-DD');
        this.DS.statusChange(date, status)
            .subscribe(
                () => {
                    this.getPage(this.page);
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    /* get edit form controls */
    get f() {
        return this.editForm.controls;
    }

    /* edit daily fund details */
    dailyFundEdit(e: any, fund: any, template: TemplateRef<any>) {
        e.preventDefault();
        this.error = false;
        this.success = false;
        this.f.price.setValue(fund.price);
        this.editFundID = fund.id;
        this.modalRef = this.MS.show(template, this.config);
    }

    /* form submit */
    dailyFundUpdate() {
        this.error = false;
        this.success = false;
        this.loading = true;
        this.submitted = true;

        // stop here if form is invalid
        if (this.editForm.invalid) {
            return;
        }
        
        var formData = {
            id: this.editFundID,
            price: this.f.price.value
        }

        this.DS.updateDailyFund(formData)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.submitted = false;
                })
            )
            .subscribe(
                () => {
                    this.success = true;
                    this.getPage(this.page);
                    setTimeout(() => this.modalRef.hide(), 2000);
                },
                (err: any) => {
                    this.error = err;
                }
            )
    }

    /**
     * Delete Daily Fund callback
     * 
     * @param date 
     */
    deleteDailyFund(date: any) {
        date = moment(date, 'DD MMM YYYY').format('YYYY-MM-DD');
        this.DS.deleteDailyFund(date)
            .subscribe(
                () => {
                    this.getPage(this.page);
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }
    
}
