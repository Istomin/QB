import { Injectable, Inject } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor( @Inject('Window') private window: Window) { }

  public set(key: string, value: any) {
    this.window.localStorage[key] = value;
  }

  public get(key: string, value?: any) {
    return this.window.localStorage[key] || value;
  }

  public setObject (key: string, value: any) {
    var parsedValue = JSON.stringify(value);
    this.window.localStorage[key] = parsedValue || '{}';
  }

  public getObject(key: string) {
    var value = this.window.localStorage[key];
    if (value == "undefined") return {};
    return JSON.parse(value || '{}');
  }

  public clearStorage(key: string) {
    this.window.localStorage.removeItem(key);
  }
}
