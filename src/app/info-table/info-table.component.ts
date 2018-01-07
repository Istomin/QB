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


const ETANoteType = ['WEATHER DELAY', 'NO SHOW AIRLINE', 'FLIGHT DELAY'];

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
  private defaultBottomColor: string = '#001a22';
  private tableHeaderColor: string;
  private shipments: Shipment[];
  private errorMessage: any;
  private tableRowColor1: any;
  private tableRowColor2: any;
  order: string;
  reverse: boolean = false;
  private showOrg: boolean;
  private showShipper: boolean;
  private dropDelivered: boolean;
  private shipmentsClone: any;
  private showTransit: boolean;
  private showExpectedDelivery: boolean;
  private refreshTimer: any;
  private pageSettings: any;
  private interval: number;
  private colunmWidths: string[];
  public scrollerApi: any;

  constructor(private settingsService: AppSettingsService, private sanitizer: DomSanitizer, private infoTableService: InfoTableService, private spinner: SpinnerService, private uploadService: UploadService, private localStorage: LocalStorageService, private datePipe: DatePipe) { }
  public ngOnInit() {
    this.subscription = this.settingsService.getTableChangeEmitter().subscribe((response) => {
      this.onAppSettingsChanged(response);
    });
    this.tableColSubscription = this.settingsService.getTableCol().subscribe((obj) => {
      this.triggerColsVisibility(obj);

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

    let cells = this.tableHeaderEl.nativeElement.rows[0].cells;

    this.colunmWidths = [];
    for (let i = 0; i < cells.length; i++) {
      this.colunmWidths[i] = cells[i].clientWidth + 'px';
    }

    this.scrollerApi = {
      getScrollToOffset: (baseOffset) => {

        let rows = this.tableBodyEl.nativeElement.rows

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

              if (visibleElementsHeight > baseOffset) {
                visibleElementsHeight -= rows[lastVisibleIndex].clientHeight;
              }

              return visibleElementsHeight;
            }
          }
        }
        return baseOffset;
      }
    }
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.refreshIntervalSubscription.unsubscribe();
    this.alertsSettingsSubscription.unsubscribe();
    this.tableColSubscription.unsubscribe();
    this.tableDataChangeSubscription.unsubscribe();
  }

  private onAppSettingsChanged(response: any) {
    this[response.param] = response.color;
  }

  private triggerColsVisibility(obj) {
    this.showOrg = obj.settings.system.flightDisplay === 0;
    this.order = this.showOrg && 'eta_departure' || 'eta_arrival';
    this.showShipper = obj.settings.system.displayMode === 0;
    this.dropDelivered = obj.settings.system.dropDelivered;
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
            shipment['shipper'] = shipment['Shipper'].Address.CompanyName + "\n" + shipment['Shipper'].Address.City + ' ' + shipment['Shipper'].Address.StateProvinceCode + ' ' + shipment['Shipper'].Address.CountryCode;
            shipment['consignee'] = shipment['Consignee'].Address.CompanyName + "\n" + shipment['Consignee'].Address.City + ' ' + shipment['Consignee'].Address.StateProvinceCode + ' ' + shipment['Consignee'].Address.CountryCode;
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
            if (shipment['DeadlineDateTime']) {
              let deadline_time = shipment['DeadlineDateTime'].DateTime;
              shipment['expectedDelivery'] = deadline_time['@Year'] + '-' + deadline_time['@Month'] + '-' + deadline_time['@Day'] + 'T' + deadline_time['@Hour'] + ':' + deadline_time['@Minute'];
            } else {
              shipment['expectedDelivery'] = '';
            }

            shipment['isDelivered'] = shipment['ShipmentStatus'] == 'Delivered';
            let status_time_obj = shipment['ShipmentStatusTime'].DateTime;
            let status_time = status_time_obj['@Year'] + '-' + status_time_obj['@Month'] + '-' + status_time_obj['@Day'] + 'T' + status_time_obj['@Hour'] + ':' + status_time_obj['@Minute'];
            status_time = this.datePipe.transform(status_time, 'MMM dd, ') + this.datePipe.transform(status_time, 'shortTime');
            shipment.status = shipment['ShipmentStatus'] + "\n" + status_time + ' ' + shipment['ShipmentStatusLocation'];

            if (shipment['ShipmentException'] && !shipment['ETADateTime']) {
              let origin = shipment['Origin'] ? shipment['Origin'] : '';
              tickers.push({
                name: shipment['ShipmentException'] + ' Shipment: ' + shipment['ShipmentJobNumber'] + ' ' + origin
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

          if (this.localStorage.getObject('userSettings') && this.localStorage.getObject('userSettings').hasOwnProperty('settings')) {
            this.applyAlertsSettings(this.localStorage.getObject('userSettings').settings.alerts);
          }

          this.getTableData(null);
        },
        (error) => {
          this.errorMessage = <any>error;
        }
        );
    }, 100);
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
            let hour = shipment['InTransitTime'].split(' ')[0],
              min = shipment['InTransitTime'].split(' ')[2];

            if (hour > +settings.secondaryInTransitTime && min > 0) {
              shipment['bgColor'] = settings.secondaryInTransitBackgroundColor;
              shipment['textColor'] = settings.secondaryInTransitTextColor;
            }
          }
        });
      }

      if (settings.primaryInTransit) {
        this.shipments.forEach((shipment) => {
          if (!shipment['isDelivered'] && shipment['InTransitTime']) {
            let hour = shipment['InTransitTime'].split(' ')[0],
              min = shipment['InTransitTime'].split(' ')[2];

            if (hour > +settings.primaryInTransitTime && min > 0) {
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
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
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
