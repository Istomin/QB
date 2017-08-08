import { Injectable } from '@angular/core';
import { GlobalVariable } from '.././core/global';
import { ProgressHttp } from "angular-progress-http";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class UploadService {
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(private http: ProgressHttp, private localStorage: LocalStorageService) { }

  uploadLogo(file: any) {
    var options = new RequestOptions();
    options.headers = new Headers();
    if(this.localStorage.get('token')) {
      options.headers.append('Authorization', 'JWT ' + this.localStorage.get('token'));
    }
    const form = new FormData();
    form.append("image", file);
    return this.http
      .post(this.makeApiUri('upload/'), form, options);
  }

  removeLogo() {
    var options = new RequestOptions();
    options.headers = new Headers();
    if(this.localStorage.get('token')) {
      options.headers.append('Authorization', 'JWT ' + this.localStorage.get('token'));
    }
    const form = new FormData();

    return this.http
      .delete(this.makeApiUri('upload/'), options);
  }

  private makeApiUri(target) {
    return [this.baseApiUrl, target].join('');
  }
}

