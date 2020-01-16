import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

	constructor(private auth: AuthService, private router: Router) { }

	intercept(request: HttpRequest<any>, next: HttpHandler):
		Observable<HttpEvent<any>> {
		return next.handle(request)
			.pipe(
				catchError(
					err => {
						if (err instanceof HttpErrorResponse) {
							if (err.status === 401) {
								// auto logout if 401 response returned from api
								this.auth.logout();
								if (this.router.url !== '/login') {
									location.reload(true);
								}
							} else if (err.status === 0) {
								const defaultError = 'Unknown Error, Please try later.';
								const error = err.statusText && err.statusText.toLowerCase() == ('Unknown error').toLowerCase() ? defaultError : err.statusText;
								return throwError(error);
							}
						}
						const error = err.error.message || err.error.error || err.message || err.statusText || err;
						return throwError(error);
					}
				)
			);
	}
}