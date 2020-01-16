import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from 'src/app/services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    // Define variables
    loading: boolean = false;
    submitted: boolean = false;
    returnUrl: string;
    error: any = '';

    // Define form 
    loginForm: FormGroup;

    /**
     * Class constructor
     * 
     * @param FB 
     * @param auth 
     * @param router 
     * @param route 
     */
    constructor(
        private FB: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    /**
     * OnInit callback
     */
    ngOnInit() {
        this.loginForm = this.FB.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

        // redirect to home if already logged in
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
        }
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    /**
     * Form submit callback
     */
    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;

        this.auth.login(
            {
                'email': this.f.username.value,
                'password': this.f.password.value
            }
        ).pipe(first())
            .subscribe(
                () => {
                    this.router.navigate([this.returnUrl]);
                }, err => {
                    this.error = err;
                    this.loading = false;
                }
            );
    }
}
