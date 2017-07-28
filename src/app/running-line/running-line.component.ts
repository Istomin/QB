import {Component, OnInit, ViewChild} from '@angular/core';
import {AppSettingsService} from "../core/app-settings.service";
import {LineDirective} from '../running-line/line';

@Component({
  selector: 'running-line',
  styleUrls: ['running-line.component.scss'],
  templateUrl: 'running-line.component.html'
})
export class RunningLineComponent implements OnInit {
  @ViewChild('line') public line: LineDirective;
  private subscription: any;
  private text: string = 'Refreshing data';

  constructor(private settingsService: AppSettingsService) {
  }

  public ngOnInit() {


    this.subscription = this.settingsService.getRunningLineData().subscribe((response) => {
      this.text = response[0];

      setTimeout(() => {
       //this.line.startAnimation();
      }, 100)
    });
  }
}
