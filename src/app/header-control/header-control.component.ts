import {Component, OnInit, ViewChild} from '@angular/core';
import {SettingsModalComponent} from '.././settings-modal';
import {AppSettingsService} from './core/app-settings.service'

@Component({
  selector: 'header-control',
  styleUrls: [ 'header-control.component.scss' ],
  templateUrl: 'header-control.component.html'
})
export class HeaderControlComponent implements OnInit {
  @ViewChild('lgModal') lgModal :SettingsModalComponent;
  constructor() {}
  public ngOnInit() {

  }
}
