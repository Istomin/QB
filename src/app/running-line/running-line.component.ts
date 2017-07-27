import {Component, OnInit} from '@angular/core';
import {AppSettingsService} from "../core/app-settings.service";

@Component({
  selector: 'running-line',
  styleUrls: [ 'running-line.component.scss' ],
  templateUrl: 'running-line.component.html'
})
export class RunningLineComponent implements OnInit {
  private subscription: any;
  private text: string;
  constructor(private settingsService: AppSettingsService) {}
  public ngOnInit() {
    this.subscription = this.settingsService.getRunningLineData().subscribe((response) => {
      this.text = response[0];
    });
  }
}
