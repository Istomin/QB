import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SettingsModalComponent } from '.././settings-modal';
import { AppSettingsService } from '.././core/app-settings.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalVariable } from '.././core/global';
import { SpinnerService } from '.././core/spinner/spinner.service';
import { LocalStorageService } from '.././core/local-storage.service';


@Component({
  selector: 'header-control',
  styleUrls: [ 'header-control.component.scss' ],
  templateUrl: 'header-control.component.html'
})
export class HeaderControlComponent implements OnInit, OnDestroy {
  @ViewChild('lgModal') public  lgModal: SettingsModalComponent;
  public subscription: Subscription;
  public userSettingsSubscription: Subscription;
  public logoSubscription: Subscription;
  private defaultBottomColor: any = '#262626';
  private titleBackground: string;
  private titleTextColor: string;
  private businessName: string = '';
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private imgUrl = 'http://board.quick.aero';
  private userSettings: any;
  private imgSrc: any;
  constructor(private settingsService: AppSettingsService, private sanitizer: DomSanitizer, private spiner: SpinnerService, private localStorage: LocalStorageService) {
  }

  public ngOnInit() {
    this.subscription = this.settingsService.getNavChangeEmitter().subscribe((response) => {
      this.onAppSettingsChanged(response);
    });

    this.userSettingsSubscription = this.settingsService.getUserSettingsData().subscribe((response) => {
      this.userSettings = response;
      this.localStorage.setObject('user', this.userSettings);
      this.setLogo(this.userSettings.logo, true);
      this.businessName = this.userSettings.business_name;
    });

    this.logoSubscription = this.settingsService.getLogoId().subscribe((logoObj) => {
      if(logoObj.isRemoved) {
        this.imgSrc = null;
      } else if(logoObj.isCanceled) {
        if(this.userSettings.logo) {
          this.setLogo(this.userSettings.logo, true);
        } else {
          this.imgSrc = null;
        }
      } else if(logoObj.isAdded) {
        this.setLogo(logoObj.logoId, false);
      } else if(logoObj.isDeleted) {
        this.imgSrc = null;
        this.userSettings.logo = null;
        this.localStorage.setObject('user', this.userSettings);
      }
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSettingsSubscription.unsubscribe();
    this.logoSubscription.unsubscribe();
  }

  showModal() {
    this.lgModal.showModal();
  }

  private onAppSettingsChanged(response: any) {
    if (response.hasOwnProperty('color')) {
      this[response.param] = response.color;
    } else {
      this[response.param] = response.value;
    }
  }

  private setLogo(id: string, fromSettings) {
    if(fromSettings) {
      this.imgSrc = this.imgUrl + id;
    } else {
      this.imgSrc = id;
    }
  }

}
