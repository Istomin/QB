import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GlobalVariable } from '.././core/global';

export class Shipment {
  constructor(public bol_number: string, public status: string, public shipper: string, public reference: string, public  eta: any, public DES: string, public ORG: string, public Flight: string) { }
}

@Injectable()
export class InfoTableService {
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(private http: Http) { }

  getShipments(value?: string) {
    return this.http
      .get(this.makeApiUri('data/'))
      .map((response: Response) => JSON.parse(response['_body']))
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    let msg = `Error status code ${error.status} at ${error.url}`;
    return Observable.throw(msg);
  }

  private makeApiUri(target) {
    return [this.baseApiUrl, target].join('');
  }
}

