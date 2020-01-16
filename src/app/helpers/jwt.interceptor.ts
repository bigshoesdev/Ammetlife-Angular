import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) { }

    intercept(req: any, next: any) {
        let tokenizedReq = req.clone({
            setHeaders: {
                Accept: 'application/json, text/plain',
                Authorization: `Bearer ${this.auth.getToken()}`
            }
        });
        return next.handle(tokenizedReq);
    }
}
