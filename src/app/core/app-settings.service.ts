import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class AppSettingsService {
  public navchange: EventEmitter<number> = new EventEmitter();
  public tablechange: EventEmitter<number> = new EventEmitter();
  public emitNavChangeEvent(numb: any) {
    this.navchange.emit(numb);
  }
  public getNavChangeEmitter() {
    return this.navchange;
  }
  public emitTableChangeEvent(numb: any) {
    this.tablechange.emit(numb);
  }
  public getTableChangeEmitter() {
    return this.tablechange;
  }
}
