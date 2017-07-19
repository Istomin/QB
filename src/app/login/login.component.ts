import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
})
export class LoginComponent implements OnDestroy {
  constructor() {}

  login() {}

  logout() {

  }

  ngOnDestroy() {
    console.log('on destroy');
  }
}
