import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SettingsModalComponent } from '.././settings-modal';
import { AppSettingsService } from '.././core/app-settings.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoTableService, Shipment } from '.././info-table/info-table.service';
import {SpinnerService} from "../core/spinner/spinner.service";
import { UploadService } from "../core/upload.service";
import {LocalStorageService} from "../core/local-storage.service";

const ETANoteType = ['WEATHER DELAY', 'NO SHOW AIRLINE', 'FLIGHT DELAY'];

@Component({
  selector: 'info-table',
  styleUrls: [ 'info-table.component.scss' ],
  templateUrl: 'info-table.component.html',
  providers: [InfoTableService, SpinnerService]
})
export class InfoTableComponent implements OnInit, OnDestroy {
  @ViewChild('lgModal') public  lgModal: SettingsModalComponent;
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
  order: string = 'eta';
  reverse : boolean = false;
  private showOrg: boolean;
  private showShipper: boolean;
  private dropDelivered: boolean;
  private shipmentsClone: any;
  private showTransit: boolean;
  private showExpectedDelivery: boolean;
  private refreshTimer: any;
  private pageSettings: any;
  private interval: number;
  constructor(private settingsService: AppSettingsService, private sanitizer: DomSanitizer, private infoTableService: InfoTableService, private spinner: SpinnerService, private uploadService: UploadService, private localStorage: LocalStorageService) {}
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
      this.getData(true);
    });

    this.alertsSettingsSubscription = this.settingsService.getAlertsSettingsEmitter().subscribe((settings) => {
      this.applyAlertsSettings(settings);
    });
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
    this.showShipper = obj.settings.system.displayMode === 0;
    this.dropDelivered = obj.settings.system.dropDelivered;
    this.showTransit = obj.settings.system.showTransit;
    this.showExpectedDelivery = obj.settings.system.showExpectedDelivery;

    if(this.shipments && this.shipments.length) {
      if (this.dropDelivered ) {
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
              if(shipment['ShippersReference']) {
                if(Array.isArray(shipment['ShippersReference'])) {
                  shipment.reference = shipment['ShippersReference'].toString();
                } else {
                  shipment.reference = shipment['ShippersReference'];
                }
              } else {
                shipment.reference = '';
              }

              if(shipment['Flights'] && shipment['Flights'].Flight) {
                if(Array.isArray(shipment['Flights'].Flight)) {
                  shipment['flight'] = shipment['Flights'].Flight[0].AirlineCode + shipment['Flights'].Flight[0].FlightNumber;
                  shipment['org'] = shipment['Flights'].Flight[0].OriginAirportCode;
                  shipment['des'] = shipment['Flights'].Flight[0].DestinationAirportCode;

                  shipment['eta_arrival'] = this.refactorValue(shipment['Flights'].Flight[0].ArrivalDateTime.DateTime['@Day']) + ' .' + this.refactorValue(shipment['Flights'].Flight[0].ArrivalDateTime.DateTime['@Hour']) + ':'  + shipment['Flights'].Flight[0].ArrivalDateTime.DateTime['@Minute'];
                  shipment['eta_departure'] = this.refactorValue(shipment['Flights'].Flight[0].DepartureDateTime.DateTime['@Day']) + ' .' + this.refactorValue(shipment['Flights'].Flight[0].DepartureDateTime.DateTime['@Hour']) + ':'  + shipment['Flights'].Flight[0].DepartureDateTime.DateTime['@Minute'];
                } else {
                  shipment['flight'] = shipment['Flights'].Flight.AirlineCode + shipment['Flights'].Flight.FlightNumber;
                  shipment['org'] = shipment['Flights'].Flight.OriginAirportCode;
                  shipment['des'] = shipment['Flights'].Flight.DestinationAirportCode;
                  shipment['eta_arrival'] = this.refactorValue(shipment['Flights'].Flight.ArrivalDateTime.DateTime['@Day']) + ' .' + this.refactorValue(shipment['Flights'].Flight.ArrivalDateTime.DateTime['@Hour']) + ':'  + shipment['Flights'].Flight.ArrivalDateTime.DateTime['@Minute'];
                  shipment['eta_departure'] = this.refactorValue(shipment['Flights'].Flight.DepartureDateTime.DateTime['@Day']) + ' .' + this.refactorValue(shipment['Flights'].Flight.DepartureDateTime.DateTime['@Hour']) + ':'  + shipment['Flights'].Flight.DepartureDateTime.DateTime['@Minute'];
                }
              } else {
                shipment['flight'] = '';
                shipment['org'] = '';
                shipment['des'] = '';
                shipment['eta_arrival'] = '';
                shipment['eta_departure'] = '';
              }

              if(shipment['DeadlineDateTime']) {
                 shipment['expectedDelivery'] = this.refactorValue(shipment['DeadlineDateTime'].DateTime['@Day']) + ' .' + shipment['DeadlineDateTime'].DateTime['@Hour'] + ':'  + shipment['DeadlineDateTime'].DateTime['@Minute'];
              } else {
                shipment['expectedDelivery'] = '';
              }

              shipment['isDelivered'] = shipment['ShipmentStatus'] == 'Delivered';
              shipment.status = shipment['ShipmentStatus'] + "\n" + this.refactorValue(shipment['ShipmentStatusTime'].DateTime['@Day']) + ' .' + this.refactorValue(shipment['ShipmentStatusTime'].DateTime['@Hour']) + ':' + shipment['ShipmentStatusTime'].DateTime['@Minute'] + ' ' + shipment['ShipmentStatusLocation'];

              if(shipment['ShipmentException']) {
                let origin = shipment['Origin'] ? shipment['Origin'] : '';
                tickers.push({
                  name: shipment['ShipmentException'] + ' Shipment: ' +  shipment['ShipmentJobNumber'] + ' ' + origin
                });
              }
            });
            this.settingsService.emitRunningLineData(tickers);

            this.shipmentsClone = this.deepCopy(this.shipments);

            if (this.dropDelivered ) {
              this.shipments = this.shipmentsClone.filter((shipment) => !shipment.isDelivered);
            } else {
              this.shipments = this.deepCopy(this.shipmentsClone);
            }

            if(this.localStorage.getObject('userSettings') && this.localStorage.getObject('userSettings').hasOwnProperty('settings')) {
              this.applyAlertsSettings(this.localStorage.getObject('userSettings').settings.alerts);
            }

            this.getTableData(null);
          },
          (error) =>  {
            this.errorMessage = <any>error;
          }
        );
    }, 100);
  }

  applyAlertsSettings(settings: any) {
    if(this.shipments && this.shipments.length) {

      this.shipments.forEach((shipment) => {
        if(shipment.hasOwnProperty('bgColor')) {
          shipment['bgColor'] = null;
          shipment['textColor'] = null;
        }
      });
      if(settings.secondaryInTransit) {
        this.shipments.forEach((shipment) => {
          if(!shipment['isDelivered'] && shipment['InTransitTime']) {
            let hour = shipment['InTransitTime'].split(' ')[0],
              min = shipment['InTransitTime'].split(' ')[2];

            if(hour > +settings.secondaryInTransitTime && min > 0) {
              shipment['bgColor'] = settings.secondaryInTransitBackgroundColor;
              shipment['textColor'] = settings.secondaryInTransitTextColor;

            }
          }
        });
      }

      if(settings.primaryInTransit) {
        this.shipments.forEach((shipment) => {
          if(!shipment['isDelivered'] && shipment['InTransitTime']) {
            let hour = shipment['InTransitTime'].split(' ')[0],
              min = shipment['InTransitTime'].split(' ')[2];

            if(hour > +settings.primaryInTransitTime && min > 0) {
              shipment['bgColor'] = settings.primaryInTransitBackgroundColor;
              shipment['textColor'] = settings.primaryInTransitTextColor;
            }
          }
        });
      }

      if(settings.etaNote) {
        this.shipments.forEach((shipment) => {
          if(shipment['ETANote'] && shipment['ETANote'].indexOf(ETANoteType[settings.etaNoteType]) >= 0) {
            shipment['bgColor'] = settings.etaNoteBackgroundColor;
            shipment['textColor'] = settings.etaNoteTextColor;
          }
        });
      }

    }
  }

  refactorValue(val: any) {
    let value = val[0] == 0 ? val.substr(1) : val;

    return value;
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
