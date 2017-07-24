import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GlobalVariable } from '.././core/global';

@Injectable()
export class LoginService {private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(private http: Http) { }

  login(value?: string) {
    return this.http
      .post(this.makeApiUri('login'), {"login": "QB_4453JHSF", "password": "ERB577WAU"})
      .do(data => console.log(data))
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

