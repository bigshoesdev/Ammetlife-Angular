import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/services';

@Component({
    selector: 'app-funds',
    templateUrl: './funds.component.html'
})

export class FundsComponent implements OnInit {
    // Define variables
    page: number = 1;
    perPage: number = 15;
    total: number;

    funds: any;

    editForm: FormGroup;
    editFundID: number;
    error: any = false;
    success: boolean = false;
    loading: any = false;
    submitted: boolean = false;

    modalRef: BsModalRef;
    config = {
        keyboard: false,
        ignoreBackdropClick: true
    };

    constructor(
        private router: Router,
        private DS: DashboardService,
        private FB: FormBuilder,
        private MS: BsModalService
    ) {
        this.editForm = this.FB.group({
            name: null,
            description: null,
            status: false,
        });
    }

    getPage(page: number) {
        this.DS.getAllFunds({ offset: page - 1, per_page: this.perPage, })
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

    // convenience getter for easy access to form fields
    get f() {
        return this.editForm.controls;
    }

    fundEdit(e: any, fund: any, template: TemplateRef<any>) {
        e.preventDefault();
        this.error = false;
        this.success = false;
        this.f.name.setValue(fund.name);
        this.f.description.setValue(fund.description);
        this.f.status.setValue(fund.status == 1 ? true : false);
        this.editFundID = fund.id;
        this.modalRef = this.MS.show(template, this.config);
    }

    onSubmit() {
        this.error = false;
        this.success = false;
        this.loading = true;
        this.submitted = true;

        var formData = {
            id: this.editFundID,
            description: this.f.description.value,
            status: this.f.status.value ? '1' : '0'
        }

        this.DS.updateFund(formData)
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

    ngOnInit() {
        this.getPage(1);
    }

}
