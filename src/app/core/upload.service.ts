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
    let options = this.getOptions();
    const form = new FormData();
    form.append("image", file);
    return this.http
      .post(this.makeApiUri('upload/'), form, options);
  }

  removeLogo() {
    let options = this.getOptions();
    return this.http
      .delete(this.makeApiUri('upload/'), options);
  }

  private getOptions() {
    var options = new RequestOptions();
    options.headers = new Headers();
    if(this.localStorage.get('token')) {
      options.headers.append('Authorization', 'JWT ' + this.localStorage.get('token'));
    }

    return options;
  }

  private makeApiUri(target) {
    return [this.baseApiUrl, target].join('');
  }
}

