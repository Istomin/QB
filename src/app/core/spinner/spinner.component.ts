import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SpinnerState, SpinnerService } from './spinner.service';
import { AppSettingsService } from '../app-settings.service';

@Component({
  selector: 'spinner',
  styleUrls: [ './spinner.component.scss' ],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnDestroy, OnInit {
  @Input('showSpinnerText')
  showSpinnerText:boolean = true;
  visible = false;
  progress: any;
  showProgress: boolean = false;
  public subscription: Subscription;
  private spinnerStateChanged: Subscription;
  private toastElement: HTMLElement|any;

  constructor(private spinnerService: SpinnerService, private settingsService: AppSettingsService) {
  }

  ngOnInit() {
    this.subscription = this.settingsService.getProgressBarNumberEmitter().subscribe((percentage) => {
      this.showProgress = percentage >=0 && percentage < 100;
      this.progress = percentage;
    });

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

    this.subscription.unsubscribe();
    this.spinnerStateChanged.unsubscribe();
  }
}
