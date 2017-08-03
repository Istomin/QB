import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SettingsModalComponent } from '.././settings-modal';
import { AppSettingsService } from '.././core/app-settings.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalVariable } from '.././core/global';
import { SpinnerService } from '.././core/spinner/spinner.service'

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
  private imgUrl = 'http://208.17.192.85:6545/depot/';
  private userSettings: any;
  private imgSrc: any;
  constructor(private settingsService: AppSettingsService, private sanitizer: DomSanitizer, private spiner: SpinnerService) {
  }

  public ngOnInit() {
    this.subscription = this.settingsService.getNavChangeEmitter().subscribe((response) => {
      this.onAppSettingsChanged(response);
    });

    this.userSettingsSubscription = this.settingsService.getUserSettingsData().subscribe((response) => {
      this.userSettings = JSON.parse(response);
      this.setLogo(this.userSettings.logo);
    });

    this.logoSubscription = this.settingsService.getLogoId().subscribe((logoId) => {
      this.setLogo(logoId);
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSettingsSubscription.unsubscribe();
    this.logoSubscription.unsubscribe();
  }

  private onAppSettingsChanged(response: any) {
    if (response.hasOwnProperty('color')) {
      this[response.param] = response.color;
    } else {
      this[response.param] = response.value;
    }
  }

  private setLogo(id: string) {
    this.imgSrc = this.imgUrl + id;
  }

  get stylish() {
    let basicStyle = `linear-gradient(0deg, ${this.defaultBottomColor}, ${this.titleBackground})`;
    return this.sanitizer.bypassSecurityTrustStyle(`
      background: -o-${basicStyle};
      background: -moz-${basicStyle};
      background: -webkit-${basicStyle};
      background: ${basicStyle};
    `);
  }
}
