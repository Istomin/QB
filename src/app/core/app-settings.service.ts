import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class AppSettingsService {
  public navchange: EventEmitter<number> = new EventEmitter();
  public tablechange: EventEmitter<number> = new EventEmitter();
  public runningLineDataChange: EventEmitter<number> = new EventEmitter();
  public userSettingsChange: EventEmitter<number> = new EventEmitter();
  public logoIdChange: EventEmitter<number> = new EventEmitter();
  public scrollIntervalChange: EventEmitter<number> = new EventEmitter();
  public tableColChange: EventEmitter<number> = new EventEmitter();
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
  public emitRunningLineData(data: any) {
    this.runningLineDataChange.emit(data);
  }
  public getRunningLineData() {
    return this.runningLineDataChange;
  }

  public emitUserSettingsData(data: any) {
    this.userSettingsChange.emit(data);
  }
  public getUserSettingsData() {
    return this.userSettingsChange;
  }

  public emitLogoId(data: any) {
    this.logoIdChange.emit(data);
  }
  public getLogoId() {
    return this.logoIdChange;
  }
  public emitScrollInterval(data: any) {
    this.scrollIntervalChange.emit(data);
  }
  public getScrollInterval() {
    return this.scrollIntervalChange;
  }
  public emitTableCol(data: any) {
    this.tableColChange.emit(data);
  }
  public getTableCol() {
    return this.tableColChange;
  }
}
