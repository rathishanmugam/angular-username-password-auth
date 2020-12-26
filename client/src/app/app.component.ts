import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { Subscription } from 'rxjs';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';
  isAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.isAuthenticated = this.authService.getIsAuth();
    console.log(this.isAuthenticated);
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        console.log(isAuthenticated);
        this.isAuthenticated = isAuthenticated;
      });
  }
  onLogout() {
    this.authService.logout();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        console.log(isAuthenticated);
        this.isAuthenticated = isAuthenticated;
      });
  }
  signup() {
    this.router.navigate(['login']);

  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
  signout() {
    this.router.navigate(['signup']);

  }
}
