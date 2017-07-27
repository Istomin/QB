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
  providers: [InfoTableService]
})
export class InfoTableComponent implements OnInit, OnDestroy {
  @ViewChild('lgModal') public  lgModal: SettingsModalComponent;
  public subscription: Subscription;
  private defaultBottomColor: string = '#001a22';
  private tableHeaderColor: string;
  private shipments: Shipment[];
  private errorMessage: any;

  constructor(private settingsService: AppSettingsService, private sanitizer: DomSanitizer, private infoTableService: InfoTableService, private spinner: SpinnerService) {}
  public ngOnInit() {
    this.subscription = this.settingsService.getTableChangeEmitter().subscribe((response) => {
      this.onAppSettingsChanged(response);
    });
    this.getTableData();
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private onAppSettingsChanged(response: any) {
    this[response.param] = response.color;
  }

  private getTableData() {
    this.spinner.show();
    this.infoTableService.getShipments()
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.shipments = response.shipment;
          // this.settingsService.emitRunningLineData(response.runningLine);
        },
        (error) =>  {
          this.errorMessage = <any>error;
        }
      );

    console.log(this.shipments, 'ssss');
  }

  get stylish() {
    let basicStyle = `linear-gradient(0deg, ${this.defaultBottomColor}, ${this.tableHeaderColor})`;
    return this.sanitizer.bypassSecurityTrustStyle(`
      background: -o-${basicStyle};
      background: -moz-${basicStyle};
      background: -webkit-${basicStyle};
      background: ${basicStyle};
    `);
  }
}
