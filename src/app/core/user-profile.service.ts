import { Injectable, OnInit } from '@angular/core';
import { LocalStorageService } from '.././core/local-storage.service'

@Injectable()
export class UserProfileService {
  public isLoggedIn: any = false;
  constructor(private localStorage: LocalStorageService) {
    this.isLoggedIn = this.localStorage.get('Authorization');
  }
}
