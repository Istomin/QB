import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettingsService } from "../core/app-settings.service";
import { LineDirective } from '../running-line/line';

@Component({
  selector: 'running-line',
  styleUrls: ['running-line.component.scss'],
  templateUrl: 'running-line.component.html'
})
export class RunningLineComponent implements OnInit {
  @ViewChild('line') public line: LineDirective;
  private subscription: any;
  private texts: [{ name: string }];
  private defaultText: boolean;
  private fontSize: any = {};

  constructor(private settingsService: AppSettingsService) {
  }

  public ngOnInit() {
    this.texts = [{
      name: 'Refreshing data'
    }];
    this.defaultText = true;

    this.settingsService.getFontSize().subscribe((fontSize) => {
      this.fontSize = fontSize;
    });

    this.subscription = this.settingsService.getRunningLineData().subscribe((tickers) => {
      if (tickers.length == 0) {
        this.texts = [{
          name: 'Refreshing data'
        }];
      } else {
        this.defaultText = false;
        this.texts.length = 0;
        this.texts = tickers;
      }

      // this.text = response.toString();

      // setTimeout(() => {
      //  this.line.startAnimation();
      // }, 100);
    });
  }
}
