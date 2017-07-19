import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class Shipment {
  constructor(public bol_number: string, public status: string, public shipper: string, public reference: string, public  eta: any, public ORG: string, public Flight: string) { }
}

@Injectable()
export class InfoTableService {
  constructor(private http: Http) { }

  getShipments(value?: string) {
    return this.http
      .get('http://208.17.192.85:6545/api/v2/')
      .map((response: Response) => <Shipment[]>response.json().data)
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    let msg = `Error status code ${error.status} at ${error.url}`;
    return Observable.throw(msg);
  }
}

