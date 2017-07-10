import {Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'settings-modal',
  styleUrls: [ 'settings-modal.component.scss' ],
  templateUrl: 'settings-modal.component.html'
})
export class SettingsModalComponent implements OnInit {
  constructor(viewContainerRef: ViewContainerRef) {}
  private viewContainerRef: ViewContainerRef;
  public ngOnInit() {

  }
}
