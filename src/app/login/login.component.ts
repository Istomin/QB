import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from './login.service';
import { UserProfileService } from '../core/user-profile.service';
import { LocalStorageService } from '../core/local-storage.service';
import { SpinnerService } from '../core/spinner/spinner.service';

import { User } from '../models/user';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  providers: [LoginService, LocalStorageService]
})
export class LoginComponent implements OnDestroy {
  private loginSub: Subscription;
  private user = new User('', '');
  private active:boolean = true;
  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private userProfileService: UserProfileService,
    private localStorage: LocalStorageService,
    private spinner: SpinnerService
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
  //  this.spinner.show();

    // setTimeout(() => {
    //   this.spinner.hide();
    //
    //   this.userProfileService.isLoggedIn = true;
    //   this.localStorage.set('Authorization', 'abcde');
    //   this.router.navigate([ '/dashboard' ]);
    //
    // }, 2000)


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
