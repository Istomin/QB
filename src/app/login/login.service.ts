import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GlobalVariable } from '.././core/global';

@Injectable()
export class LoginService {private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(private http: Http) { }

  login(obj: any) {
    return this.http
      .post(this.makeApiUri('auth/login/'), obj)
      .do(data => data)
      .catch(this.handleError);
  }

  getUserInfo() {
    return this.http
      .get(this.makeApiUri('auth/me/'))
      .do(data => data)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    let msg = `Error status code ${error.status} at ${error.url}`;
    return Observable.throw(msg);
  }

  private makeApiUri(target) {
    return [this.baseApiUrl, target].join('');
  }
}

