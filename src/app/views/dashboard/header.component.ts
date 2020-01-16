import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles: []
})

export class HeaderComponent implements OnInit {
    /**
     * Class constructor
     * 
     * @param auth 
     * @param router 
     */
    constructor(
        public auth: AuthService,
        private router: Router
    ) { }

    /**
     * On Init callback
     */
    ngOnInit() {
    }

    /**
     * Logout callback
     * 
     * @param event 
     */
    logout(event: any) {
        event.preventDefault();
        this.auth.logout();
        this.router.navigate(["/login"]);
    }

    /**
     *Check user is loggedin or not 
     */
    isAuthorized() {
        return this.auth.isLoggedIn();
    }
}
