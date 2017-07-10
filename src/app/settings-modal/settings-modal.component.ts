import {Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
@Component({
  selector: 'settings-modal',
  styleUrls: [ 'settings-modal.component.scss' ],
  templateUrl: 'settings-modal.component.html'
})
export class SettingsModalComponent implements OnInit {
  @ViewChild('lgModal') public lgModal:ModalDirective;
  constructor(viewContainerRef: ViewContainerRef) {

  }
  private viewContainerRef: ViewContainerRef;
  public ngOnInit() {

  }
}
