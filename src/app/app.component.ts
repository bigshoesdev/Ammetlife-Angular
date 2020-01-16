import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    title = 'AmmetLife';

    constructor(private router: Router, private auth: AuthService) {

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (this.auth.isLoggedIn()) {
                    if (event.url.indexOf('/dashboard') >= 0) {
                        this.auth.AuthUser().subscribe(
                            res =>{
                                this.auth.currentUser = res.data
                            }
                        );
                    }
                }
            }
        });
    }
}