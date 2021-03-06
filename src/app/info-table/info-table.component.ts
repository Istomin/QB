import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SettingsModalComponent } from '.././settings-modal';
import { AppSettingsService } from '.././core/app-settings.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoTableService, Shipment } from '.././info-table/info-table.service';
import { SpinnerService } from "../core/spinner/spinner.service";
import { UploadService } from "../core/upload.service";
import { LocalStorageService } from "../core/local-storage.service";

import { ElementRef } from '@angular/core';
import { Subscribable } from 'rxjs/Observable';
import { WindowRef } from '../core/window-ref';
import { debounce } from 'rxjs/operator/debounce';


const ETANoteType = ['WEATHER DELAY', 'NO SHOW AIRLINE', 'AIRLINE DELAY'];

@Component({
  selector: 'info-table',
  styleUrls: ['info-table.component.scss'],
  templateUrl: 'info-table.component.html',
  providers: [InfoTableService, SpinnerService, DatePipe]
})
export class InfoTableComponent implements OnInit, OnDestroy {
  @ViewChild('lgModal') public lgModal: SettingsModalComponent;
  @ViewChild('tableHeader') tableHeaderEl: ElementRef;
  @ViewChild('tableBody') tableBodyEl: ElementRef;

  public subscription: Subscription;
  public tableColSubscription: Subscription;
  public refreshIntervalSubscription: Subscription;
  public tableDataChangeSubscription: Subscription;
  public alertsSettingsSubscription: Subscription;
  public fontSizeSubscription: Subscription;
  public fontSize: any = {};
  private defaultBottomColor: string = '#001a22';
  private tableHeaderColor: string;
  private shipments: Shipment[];
  private errorMessage: any;
  private tableRowColor1: any;
  private tableRowColor2: any;
  order: string;
  reverse: boolean = false;
  private showOrg: boolean;
  private showShipper: boolean = true;
  private showConsignee: boolean = true;
  private dropDelivered: boolean;
  private numberOfSigns: number;
  private shipmentsClone: any;
  private showTransit: boolean;
  private showExpectedDelivery: boolean;
  private refreshTimer: any;
  private pageSettings: any;
  private interval: number;
  private colunmWidths: {};
  public scrollerApi: any;
  private resizeLintener: any;
  private recalculateTimer: any;

  constructor(private settingsService: AppSettingsService, private sanitizer: DomSanitizer, private infoTableService: InfoTableService, private spinner: SpinnerService, private uploadService: UploadService, private localStorage: LocalStorageService, private datePipe: DatePipe,
    private winRef: WindowRef) { }
  public ngOnInit() {
    this.subscription = this.settingsService.getTableChangeEmitter().subscribe((response) => {
      this.onAppSettingsChanged(response);
    });
    this.tableColSubscription = this.settingsService.getTableCol().subscribe((obj) => {
      this.triggerColsVisibility(obj);
    });

    this.fontSizeSubscription = this.settingsService.getFontSize().subscribe((fontSize) => {
      this.fontSize = fontSize;
    });

    this.getData(false);
    this.refreshIntervalSubscription = this.settingsService.getRefreshInterval().subscribe((interval) => {
      this.getTableData(interval);
    });

    this.tableDataChangeSubscription = this.settingsService.getTableDataChangeEmitter().subscribe(() => {
      this.shipments = null;
      this.settingsService.emitRunningLineData([]);
      this.getData(true);
    });

    this.alertsSettingsSubscription = this.settingsService.getAlertsSettingsEmitter().subscribe((settings) => {
      this.applyAlertsSettings(settings);
    });

    this.scrollerApi = this.getScrollerApi();

    this.resizeLintener = () => {
      this.recalculateColumnsWidthWithDelay();
    };

    this.winRef.nativeWindow.addEventListener('resize', this.resizeLintener);

    this.recalculateColumnsWidthWithDelay();

    let settings = this.getLocalSettings();
    if (settings) {
      this.settingsService.emitFontSizeChange(settings.fontSizes);
    }

  }

  private getShowShipperConsigneeHeader() {
    if (this.showConsignee && this.showShipper) {
      return 'Shipper / Consignee';
    }
    else {
      if (this.showShipper) {
        return 'Shipper';
      }
      if (this.showConsignee) {
        return 'Consignee';
      }
    }
  }

  private recalculateColumnsWidthWithDelay() {
    if (this.recalculateTimer) {
      clearTimeout(this.recalculateTimer);
      this.recalculateTimer = null;
    }
    this.recalculateTimer = setTimeout(() => {
      this.recalculateColumnsWidth();
    }, 1000);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.refreshIntervalSubscription.unsubscribe();
    this.alertsSettingsSubscription.unsubscribe();
    this.tableColSubscription.unsubscribe();
    this.tableDataChangeSubscription.unsubscribe();

    this.winRef.nativeWindow.removeEventListener('resize', this.resizeLintener);
  }

  private recalculateColumnsWidth() {
    let cells = this.tableHeaderEl.nativeElement.rows[0].cells;

    this.colunmWidths = {};
    for (let i = 0; i < cells.length - 1; i++) {
      let key = cells[i].attributes['key'].value;
      this.colunmWidths[key] = cells[i].clientWidth + 'px';
    }
  }

  private getScrollerApi() {
    return {
      getScrollToOffsetData: (baseHeight) => {

        let rows = this.tableBodyEl.nativeElement.rows
        let previousRowsHeight = 0;

        let lastVisibleIndex = -1;
        let visibleElementsHeight = 0;
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          if (this.isElementInViewport(row)) {
            lastVisibleIndex = i;
            visibleElementsHeight += row.clientHeight;
          }
          else {
            if (lastVisibleIndex !== -1 && i > lastVisibleIndex) {

              return {
                visibleHeight: visibleElementsHeight,
                hidenHeight: previousRowsHeight
              };
            }
            previousRowsHeight += row.clientHeight;
          }
        }
        return {
          visibleHeight: baseHeight,
          hidenHeight: 0
        };
      }
    }
  }

  private onAppSettingsChanged(response: any) {
    this[response.param] = response.color;
  }

  private triggerColsVisibility(obj) {
    this.showOrg = obj.settings.system.flightDisplay === 0;
    this.order = this.showOrg && 'eta_departure' || 'eta_arrival';

    if (this.showShipper != obj.settings.system.displayShipper || this.showConsignee != obj.settings.system.displayConsignee) {
      this.recalculateColumnsWidthWithDelay();
    }

    this.showShipper = obj.settings.system.displayShipper === undefined ? true : obj.settings.system.displayShipper;
    this.showConsignee = obj.settings.system.displayConsignee === undefined ? true : obj.settings.system.displayConsignee;

    this.dropDelivered = obj.settings.system.dropDelivered;
    this.numberOfSigns = obj.settings.system.numberOfSigns;
    this.showTransit = obj.settings.system.showTransit;
    this.showExpectedDelivery = obj.settings.system.showExpectedDelivery;

    if (this.shipments && this.shipments.length) {
      if (this.dropDelivered) {
        this.shipments = this.shipmentsClone.filter((shipment) => !shipment.isDelivered);
      } else {
        this.shipments = this.deepCopy(this.shipmentsClone);
      }
    }
  }

  private getTableData(interval: number) {
    this.interval = interval ? interval : this.interval;
    clearInterval(this.refreshTimer);

    this.refreshTimer = setInterval(() => {
      this.getData(false);
    }, 600 * 100 * this.interval);
  }

  getData(needUpdate: boolean) {
    setTimeout(() => {
      this.spinner.show();
      this.uploadService.getTableData()
        .subscribe(
        (response) => {
          this.spinner.hide();
          this.shipments = response.TransactionResponse.Shipments.Shipment;
          var tickers = [];

          this.shipments.forEach((shipment) => {
            shipment['shipper'] = shipment['Shipper'].Address.CompanyName + "\n" + shipment['Shipper'].Address.City + ' ' + (shipment['Shipper'].Address.StateProvinceCode || '') + ' ' + (shipment['Shipper'].Address.CountryCode || '');
            shipment['consignee'] = shipment['Consignee'].Address.CompanyName + "\n" + shipment['Consignee'].Address.City + ' ' + (shipment['Consignee'].Address.StateProvinceCode || '')  + ' ' + (shipment['Consignee'].Address.CountryCode || '');

            if (shipment['ShippersReference']) {
              if (Array.isArray(shipment['ShippersReference'])) {
                shipment.reference = shipment['ShippersReference'].join(', ');
              } else {
                shipment.reference = shipment['ShippersReference'];
              }
            } else {
              shipment.reference = '';
            }

            if (shipment['Flights'] && shipment['Flights'].Flight) {
              if (Array.isArray(shipment['Flights'].Flight)) {
                if (this.showOrg) {
                  var flight = shipment['Flights'].Flight[0];
                } else {
                  var flight = shipment['Flights'].Flight.slice(-1)[0];
                }
                shipment['flight'] = flight.AirlineCode + flight.FlightNumber;
                shipment['org'] = flight.OriginAirportCode;
                shipment['des'] = flight.DestinationAirportCode;
                let arrival_date = flight.ArrivalDateTime.DateTime;
                let departure_date = flight.DepartureDateTime.DateTime;
                shipment['eta_arrival'] = arrival_date['@Year'] + '-' + arrival_date['@Month'] + '-' + arrival_date['@Day'] + 'T' + arrival_date['@Hour'] + ':' + arrival_date['@Minute'];
                shipment['eta_departure'] = departure_date['@Year'] + '-' + departure_date['@Month'] + '-' + departure_date['@Day'] + 'T' + departure_date['@Hour'] + ':' + departure_date['@Minute'];

              } else {
                shipment['flight'] = shipment['Flights'].Flight.AirlineCode + shipment['Flights'].Flight.FlightNumber;
                shipment['org'] = shipment['Flights'].Flight.OriginAirportCode;
                shipment['des'] = shipment['Flights'].Flight.DestinationAirportCode;
                let arrival_date = shipment['Flights'].Flight.ArrivalDateTime.DateTime;
                let departure_date = shipment['Flights'].Flight.DepartureDateTime.DateTime;
                shipment['eta_arrival'] = arrival_date['@Year'] + '-' + arrival_date['@Month'] + '-' + arrival_date['@Day'] + 'T' + arrival_date['@Hour'] + ':' + arrival_date['@Minute'];
                shipment['eta_departure'] = departure_date['@Year'] + '-' + departure_date['@Month'] + '-' + departure_date['@Day'] + 'T' + departure_date['@Hour'] + ':' + departure_date['@Minute'];
              }
            } else {
              shipment['flight'] = '';
              shipment['org'] = '';
              shipment['des'] = '';
              shipment['eta_arrival'] = '';
              shipment['eta_departure'] = '';
            }
            // expected delivery
            let expected_delivery;
            if (shipment['ETADateTime']) {
                expected_delivery = shipment['ETADateTime'].DateTime;
            }
            else if (shipment['DeadlineDateTime']) {
                expected_delivery = shipment['DeadlineDateTime'].DateTime;
            }
            if (expected_delivery) {
              shipment['expectedDelivery'] = expected_delivery['@Year'] + '-' + expected_delivery['@Month'] + '-' + expected_delivery['@Day'] + 'T' + expected_delivery['@Hour'] + ':' + expected_delivery['@Minute'];
            } else {
              shipment['expectedDelivery'] = '';
            }

            shipment['isDelivered'] = shipment['ShipmentStatus'] == 'Delivered';
            let status_time_obj = shipment['ShipmentStatusTime'].DateTime;
            let status_time = status_time_obj['@Year'] + '-' + status_time_obj['@Month'] + '-' + status_time_obj['@Day'] + 'T' + status_time_obj['@Hour'] + ':' + status_time_obj['@Minute'];
            status_time = this.datePipe.transform(status_time, 'MMM dd, ') + this.datePipe.transform(status_time, 'shortTime');
            shipment.status = shipment['ShipmentStatus'] + "\n" + status_time + ' ' + shipment['ShipmentStatusLocation'];

            if (shipment['ShipmentException'] && !shipment['ETADateTime']) {
              let addr =  this.showShipper ? shipment['Shipper'].Address : shipment['Consignee'].Address;
              let origin = 'Origin: ' + addr.City + ' ' + addr.StateProvinceCode + ' ' + addr.CountryCode;
              tickers.push({
                name: shipment['ShipmentException'] + ' Shipment: ' + shipment['ShipmentBOLNumber'] + ' ' + origin
              });
            }
          });
          this.settingsService.emitRunningLineData(tickers);

          this.shipmentsClone = this.deepCopy(this.shipments);

          if (this.dropDelivered) {
            this.shipments = this.shipmentsClone.filter((shipment) => !shipment.isDelivered);
          } else {
            this.shipments = this.deepCopy(this.shipmentsClone);
          }

          let settings = this.getLocalSettings();
          if (settings) {
            this.applyAlertsSettings(settings.alerts);
          }

          this.getTableData(null);
        },
        (error) => {
          this.errorMessage = <any>error;
        }
        );
    }, 100);
  }

  getLocalSettings() {
    let localData = this.localStorage.getObject('userSettings')
    return localData && localData.settings || null;
  }

  parseInTransit(shipment){
      let hours = 0;
      let timeObj = shipment['InTransitTime'].split(' ');
      if(timeObj[1] === 'd') {
          hours = parseInt(timeObj[0]) * 24 + parseInt(timeObj[2]);
      } else if (timeObj[1] === 'h'){
          hours = parseInt(timeObj[0]) + 1;  // stupid? yeh, but same as original AIR app
      } else {
          hours = 1;
      }
      return hours;
  }

  applyAlertsSettings(settings: any) {
    if (this.shipments && this.shipments.length) {

      this.shipments.forEach((shipment) => {
        if (shipment.hasOwnProperty('bgColor')) {
          shipment['bgColor'] = null;
          shipment['textColor'] = null;
        }
      });

      if (settings.secondaryInTransit) {
        this.shipments.forEach((shipment) => {
          if (!shipment['isDelivered'] && shipment['InTransitTime']) {
            let hours = this.parseInTransit(shipment);
            if (hours >= settings.secondaryInTransitTime) {
              shipment['bgColor'] = settings.secondaryInTransitBackgroundColor;
              shipment['textColor'] = settings.secondaryInTransitTextColor;
            }
          }
        });
      }

      if (settings.primaryInTransit) {
        this.shipments.forEach((shipment) => {
          if (!shipment['isDelivered'] && shipment['InTransitTime']) {
            let hours = this.parseInTransit(shipment);

            if (hours >= settings.primaryInTransitTime) {
              shipment['bgColor'] = settings.primaryInTransitBackgroundColor;
              shipment['textColor'] = settings.primaryInTransitTextColor;
            }
          }
        });
      }

      if (settings.etaNote) {

        this.shipments.forEach((shipment) => {
          if (shipment['ETANote'] && shipment['ETANote'].indexOf(ETANoteType[settings.etaNoteType]) >= 0) {
            shipment['bgColor'] = settings.etaNoteBackgroundColor;
            shipment['textColor'] = settings.etaNoteTextColor;
          }
        });
      }

    }
  }

  private isElementInViewport(el) {

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (this.winRef.nativeWindow.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (this.winRef.nativeWindow.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }

  private deepCopy(oldObj: any) {
    let newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
      newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
      for (let i in oldObj) {
        newObj[i] = this.deepCopy(oldObj[i]);
      }
    }
    return newObj;
  }
}
