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
        this.toggleVisibility(state.show);
      });

    this.toastElement = document.getElementById('spinner');
  }

  toggleVisibility(state: boolean) {
    this.toastElement.style.display = state ? 'block' : 'none';
  }

  ngOnDestroy() {

    this.spinnerStateChanged.unsubscribe();
  }
}
