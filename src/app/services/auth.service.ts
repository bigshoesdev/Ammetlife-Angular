import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import SimpleCrypto from "simple-crypto-js";
import { UrlService } from './url.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private _secretKey = "x9$lPGl1BWdQfVLpQd@J8r*ylY#1wu9j6OpXO7tEnM";
    private simpleCrypto: any;
    public currentUser: any = null;

    constructor(
        private http: HttpClient,
        private url: UrlService
    ) {
        this.simpleCrypto = new SimpleCrypto(this._secretKey);
    }

    private setSession(authResult: any) {
        localStorage.setItem('userToken', this.simpleCrypto.encrypt(authResult.data.token));
    }

    private deleteSession() {
        localStorage.removeItem("userToken");
    }

    public getToken() {
        if (!localStorage.getItem("userToken")) return false;
        return this.simpleCrypto.decrypt(localStorage.getItem("userToken"));
    }

    public isLoggedIn() {
        if (this.getToken()) {
            return true;
        } else {
            this.logout();
            return false;
        }
    }

    public login(user: any) {
        return this.http.post<any>(this.url.get('login'), user)
            .pipe(
                map(
                    res => {
                        this.setSession(res);
                    }
                )
            );
    }

    public logout() {
        this.deleteSession();
    }

    public AuthUser() {
        return this.http.get<any>(this.url.get('user'));
    }

    public update(data: any) {
        return this.http.post(this.url.get('updateuser'), data);
    }
}
