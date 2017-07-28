import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {LoginService} from './login.service';
import {UserProfileService} from '../core/user-profile.service';
import {LocalStorageService} from '../core/local-storage.service';
import {SpinnerService} from '../core/spinner/spinner.service';

import {User} from '../models/user';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService, LocalStorageService]
})
export class LoginComponent implements OnDestroy {
  private loginSub: Subscription;
  private user = new User('', '');
  private active: boolean = true;
  private invalidCreds: boolean = false;

  constructor(private loginService: LoginService,
              private route: ActivatedRoute,
              private router: Router,
              private userProfileService: UserProfileService,
              private localStorage: LocalStorageService,
              private spinner: SpinnerService) {
  }

  public get isLoggedIn(): boolean {
    return this.userProfileService.isLoggedIn;
  }

  public ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  private login() {
    this.spinner.show();

    let loginResults = null;
   /// {"login": "QB_4453JHSF", "password": "ERB577WAU"}
    this.loginSub = this.loginService
      .login(this.user)
      .mergeMap((loginResult) => {
        loginResults = JSON.parse(loginResult._body);
        return this.route.queryParams
      })
      .map((qp) => qp['redirectTo'])
      .subscribe((redirectTo) => {
        if (loginResults && loginResults.hasOwnProperty('status')) {
          this.invalidCreds = true;
        } else {
          this.localStorage.set('token', loginResults.token);
          this.userProfileService.isLoggedIn = true;
          let url = redirectTo ? [redirectTo] : ['/dashboard'];
          this.router.navigate(url);
        }
        this.spinner.hide();
      });
  }

}
