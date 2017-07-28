import {Injectable} from "@angular/core";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {LocalStorageService} from "./local-storage.service";

@Injectable()
export class InterceptedHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private localStorage: LocalStorageService) {
    super(backend, defaultOptions);
  }
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

    return super.request(url, options).catch((err: any) => {
      //  alert(err.status);
        if(err.status == 0) {
        //  alert('No server connection');
          return Observable.empty();
        } else if (err.status === 400 || err.status === 422) {

          return Observable.throw(err);
        } else if (err.status === 500) {

          return Observable.throw(err);
        } else {
          return Observable.empty();
        }
    });
  }
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {

    return super.get(url, this.getRequestOptionArgs(options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {

    return super.post(url, body, this.getRequestOptionArgs(options));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {

    return super.put(url, body, this.getRequestOptionArgs(options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {

    return super.delete(url, this.getRequestOptionArgs(options));
  }


  private getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');
    if(this.localStorage.get('token')) {
      options.headers.append('Authorization', 'JWT ' + this.localStorage.get('token'));
    }

    return options;
  }
}
