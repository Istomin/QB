import {XHRBackend, Http, RequestOptions} from "@angular/http";
import {InterceptedHttp} from "./intercepted-http";
import {LocalStorageService} from "./local-storage.service";

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, localStorage: LocalStorageService): Http {
  return new InterceptedHttp(xhrBackend, requestOptions, localStorage);
}
