import { Injectable, Inject } from '@angular/core';
import {WindowRef} from '../core/window-ref';
@Injectable()
export class LocalStorageService {
  constructor( private winRef: WindowRef) { }

  public set(key: string, value: any) {
    this.winRef.nativeWindow['localStorage'][key] = value;
  }

  public get(key: string, value?: any) {
    return this.winRef.nativeWindow['localStorage'][key] || value;
  }

  public setObject (key: string, value: any) {
    var parsedValue = JSON.stringify(value);
    this.winRef.nativeWindow['localStorage'][key] = parsedValue || '{}';
  }

  public getObject(key: string) {
    var value = this.winRef.nativeWindow['localStorage'][key];
    if (value == "undefined") return {};
    return JSON.parse(value || '{}');
  }

  public clearStorage(key: string) {
    this.winRef.nativeWindow['localStorage'].removeItem(key);
  }
}
