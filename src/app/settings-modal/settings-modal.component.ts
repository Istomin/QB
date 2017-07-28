import { Component, OnInit, ViewContainerRef, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppSettingsService } from '../core/app-settings.service';
import { SettingsTabsComponent } from  './settings-tabs';

@Component({
  selector: 'settings-modal',
  styleUrls: [ 'settings-modal.component.scss' ],
  templateUrl: 'settings-modal.component.html'
})
export class SettingsModalComponent implements OnInit {
  @ViewChild('lgModal') public lgModal: ModalDirective;
  @ViewChild(SettingsTabsComponent) public settingsTabsComponent: SettingsTabsComponent;
  private viewContainerRef: ViewContainerRef;
  @Output() onModalClose: EventEmitter<{}>;
  constructor(viewContainerRef: ViewContainerRef, private settingsService: AppSettingsService) {

  }
  public ngOnInit() {

  }

  cancelSaving() {
    this.settingsTabsComponent.resetToPreviousSettings();
    this.lgModal.hide();
  }

  saveSettings() {
    this.settingsTabsComponent.saveSettings();
    this.lgModal.hide();
  }

  testMe() {
    this.settingsService.emitNavChangeEvent(1);
  }
}
