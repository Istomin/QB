import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SettingsModalComponent } from '.././settings-modal';
import { AppSettingsService } from '.././core/app-settings.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoTableService, Shipment } from '.././info-table/info-table.service';
import {SpinnerService} from "../core/spinner/spinner.service";


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
  constructor(private settingsService: AppSettingsService, private sanitizer: DomSanitizer, private infoTableService: InfoTableService, private spinner: SpinnerService) {}
  public ngOnInit() {
    this.subscription = this.settingsService.getTableChangeEmitter().subscribe((response) => {
      this.onAppSettingsChanged(response);
    });
    this.tableColSubscription = this.settingsService.getTableCol().subscribe((obj) => {
      this.triggerColsVisibility(obj);
    });
    this.getTableData();
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tableColSubscription.unsubscribe();
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

  private getTableData() {
    setTimeout(() => {
      this.spinner.show();
      this.infoTableService.getShipments()
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
                  shipment['flight'] = shipment['Flights'].Flight[0].AirlineCode + shipment['Flights'].Flight[0].AirwayBillNumber;
                  shipment['org'] = shipment['Flights'].Flight[0].OriginAirportCode;
                  shipment['des'] = shipment['Flights'].Flight[0].DestinationAirportCode;
                } else {
                  shipment['flight'] = shipment['Flights'].Flight.AirlineCode + shipment['Flights'].Flight.AirwayBillNumber;
                  shipment['org'] = shipment['Flights'].Flight.OriginAirportCode;
                  shipment['des'] = shipment['Flights'].Flight.DestinationAirportCode;
                }
              } else {
                shipment['flight'] = '';
                shipment['org'] = '';
                shipment['des'] = '';
              }

              let expectedDeliveryMonth = shipment['DeadlineDateTime'].DateTime['@Month'][0] == 0 ? shipment['DeadlineDateTime'].DateTime['@Month'].substr(1) : shipment['DeadlineDateTime'].DateTime['@Month'];
              shipment['expectedDelivery'] = expectedDeliveryMonth + ' .' + shipment['DeadlineDateTime'].DateTime['@Hour'] + ':'  + shipment['DeadlineDateTime'].DateTime['@Hour'];

              shipment['isDelivered'] = shipment['ShipmentStatus'] == 'Delivered';
              let deliveryMonth = shipment['ShipmentStatusTime'].DateTime['@Month'][0] == 0 ? shipment['ShipmentStatusTime'].DateTime['@Month'].substr(1) : shipment['ShipmentStatusTime'].DateTime['@Month'];
              shipment.status = shipment['ShipmentStatus'] + "\n" + deliveryMonth + ' .' + shipment['ShipmentStatusTime'].DateTime['@Hour'] + ':' + shipment['ShipmentStatusTime'].DateTime['@Minute'] + ' ' + shipment['ShipmentStatusLocation'];

              if(shipment['ETADateTime']) {
                let etaMonth = shipment['ETADateTime'].DateTime['@Month'][0] == 0 ? shipment['ETADateTime'].DateTime['@Month'].substr(1) : shipment['ETADateTime'].DateTime['@Month'];
                shipment.eta = etaMonth + ' .' + shipment['ETADateTime'].DateTime['@Hour'] + ':'  + shipment['ETADateTime'].DateTime['@Hour'];
              } else {
                shipment.eta = '';
              }

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
          },
          (error) =>  {
            this.errorMessage = <any>error;
          }
        );
    }, 100);
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
