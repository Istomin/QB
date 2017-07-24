import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SpinnerState, SpinnerService } from './spinner.service';

@Component({
  selector: 'spinner',
  styleUrls: [ './spinner.component.scss' ],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnDestroy, OnInit {
  visible = false;

  private spinnerStateChanged: Subscription;
  private toastElement: HTMLElement|any;

  constructor(private spinnerService: SpinnerService) {
  }

  ngOnInit() {

    this.spinnerStateChanged = this.spinnerService.spinnerState
      .subscribe((state: SpinnerState) => {
      console.log(state, 'statestatestate')
      });

    this.toastElement = document.getElementById('spinner');
    this.toastElement.style.display = 'none';
  }

  ngOnDestroy() {
    this.spinnerStateChanged.unsubscribe();
  }
}
