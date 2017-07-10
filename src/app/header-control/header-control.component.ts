import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {SettingsModalComponent} from '.././settings-modal';
import {AppSettingsService} from '.././core/app-settings.service';
import {Subscription} from 'rxjs/Subscription';
@Component({
  selector: 'header-control',
  styleUrls: [ 'header-control.component.scss' ],
  templateUrl: 'header-control.component.html'
})
export class HeaderControlComponent implements OnInit {

  private titleBackground: string;
  private titleTextColor: string;

  @ViewChild('lgModal') lgModal :SettingsModalComponent;
  subscription: Subscription;
  constructor(private settingsService: AppSettingsService) {

  }

  public ngOnInit() {
    this.subscription = this.settingsService.getNavChangeEmitter().subscribe((response) => {
      this.onAppSettingsChanged(response);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAppSettingsChanged(response:any) {
    this[response.param] = response.color;
  }
}
