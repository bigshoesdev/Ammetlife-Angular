import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ChartModule } from 'angular-highcharts';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule, ModalModule, TooltipModule } from 'ngx-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { JwtInterceptor, AuthGuard, ErrorInterceptor } from './helpers';
import { AuthService, UrlService, DashboardService } from './services';

import {
    FundsDetailsComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    UploadComponent,
    FundsComponent,
    DailyfundsComponent,
    EditProfileComponent
} from './views';
import { HeaderComponent } from './views/dashboard/header.component';
import { BackupComponent } from './views/dashboard/backup/backup.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        FundsDetailsComponent,
        LoginComponent,
        DashboardComponent,
        UploadComponent,
        FundsComponent,
        DailyfundsComponent,
        EditProfileComponent,
        HeaderComponent,
        BackupComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ChartModule,
        ReactiveFormsModule,
        FormsModule,
        NgProgressModule,
        NgProgressHttpModule,
        NgxPaginationModule,
        BrowserAnimationsModule,
        NgHttpLoaderModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        SweetAlert2Module.forRoot(),
    ],
    providers: [
        AuthService,
        AuthGuard,
        UrlService,
        DashboardService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
