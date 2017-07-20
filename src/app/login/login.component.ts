import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from './login.service';
import { UserProfileService } from '../core/user-profile.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  providers: [LoginService]
})
export class LoginComponent implements OnDestroy {
  private loginSub: Subscription;
  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private userProfileService: UserProfileService
  ) {}
  public get isLoggedIn(): boolean {
    return this.userProfileService.isLoggedIn;
  }
  public ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
  private login() {
    this.loginSub = this.loginService
      .login()
      .mergeMap((loginResult) => this.route.queryParams)
      .map((qp) => qp['redirectTo'])
      .subscribe((redirectTo) => {
        console.log(`Successfully logged in`);
        if (this.userProfileService.isLoggedIn) {
          let url = redirectTo ? [redirectTo] : [ '/dashboard' ];
          this.router.navigate(url);
        }
      });
  }

}
