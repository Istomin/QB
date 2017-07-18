import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppSettingsService } from '../core/app-settings.service';

@Component({
  selector: 'settings-modal',
  styleUrls: [ 'settings-modal.component.scss' ],
  templateUrl: 'settings-modal.component.html'
})
export class SettingsModalComponent implements OnInit {
  @ViewChild('lgModal') public lgModal: ModalDirective;
  private viewContainerRef: ViewContainerRef;
  constructor(viewContainerRef: ViewContainerRef, private settingsService: AppSettingsService) {

  }
  public ngOnInit() {
    console.log(1);
  }
  testMe() {
    this.settingsService.emitNavChangeEvent(1);
  }
}
