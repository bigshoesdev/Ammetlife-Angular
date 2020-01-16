import { Component, OnInit } from '@angular/core';
import { FundsService } from 'src/app/services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: []
})

export class HomeComponent implements OnInit {

    data: any = [];
    error: any;

    constructor(private FS: FundsService) { }

    ngOnInit() {
        this.loadDailyFunds();
    }

    loadDailyFunds() {
        this.FS.getDailyFunds()
            .subscribe(
                res => {
                    this.data = res ? res : [];
                },
                error => this.error = <any>error
            );
    }
}
