import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SettingsModalComponent } from '.././settings-modal';
import { AppSettingsService } from '.././core/app-settings.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';

import { SpinnerService } from '.././core/spinner/spinner.service'

@Component({
  selector: 'header-control',
  styleUrls: [ 'header-control.component.scss' ],
  templateUrl: 'header-control.component.html'
})
export class HeaderControlComponent implements OnInit, OnDestroy {
  @ViewChild('lgModal') public  lgModal: SettingsModalComponent;
  public subscription: Subscription;
  private defaultBottomColor: any = '#262626';
  private titleBackground: string;
  private titleTextColor: string;
  constructor(private settingsService: AppSettingsService, private sanitizer: DomSanitizer, private spiner: SpinnerService) {
  }

  public ngOnInit() {
    this.subscription = this.settingsService.getNavChangeEmitter().subscribe((response) => {
      this.onAppSettingsChanged(response);
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private onAppSettingsChanged(response: any) {
    if (response.hasOwnProperty('color')) {
      this[response.param] = response.color;
    } else {
      this[response.param] = response.value;
    }
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
