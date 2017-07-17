import { Component, ViewChild, OnInit } from '@angular/core';
import { ColorPickerComponent } from '../color-picker'
import { Settings } from '../../models/settings.model';
import { AppSettingsService } from '../../core/app-settings.service';

@Component({
  selector: 'settings-tabs',
  styleUrls: [ 'settings-tabs.component.scss'],
  templateUrl: './settings-tabs.component.html'
})
export class SettingsTabsComponent implements OnInit {
  @ViewChild(ColorPickerComponent) public colorPickerComponent: ColorPickerComponent;
  private pageSettings: Settings;
  private min: number = 1;
  private max: number = 20;
  private step: number = 1;
  private val: number = 5;
  constructor(private settingsService: AppSettingsService) { }

  public ngOnInit() {
    this.pageSettings = {
      settings: {
        system: {
          refreshInterval: 1,
          scrollInterval: 1,
          displayMode: 1,
          flightDisplay: 1,
          showTransit: true,
          showTransitType: 1,
          showExpectedDelivery: true,
          dropDelivered: true
        },
        alerts: {
          primaryInTransit: true,
          primaryInTransitTime: 1,
          primaryInTransitTextColor: '#f00',
          primaryInTransitBackgroundColor: '#f00',
          secondaryInTransit: true,
          secondaryInTransitTime: 1,
          secondaryInTransitTextColor: '#f00',
          secondaryInTransitBackgroundColor: '#f00',
          etaNote: true,
          etaNoteType: 1,
          etaNoteTextColor: '#f00',
          etaNoteBackgroundColor: '#f00',
        },
        graphics: {
          titleBackground: '#f00',
          titleTextColor: '#f00',
          tableHeaderColor: '#f00',
          tableTextColor: '#fff',
          tableRowColor1: '#f00',
          tableRowColor2: '#f00',
          businessName: 'Your Business Name Here'
        }
      }
    };
  }

  private onColorChanged(colorObj) {
    this.pageSettings.settings.graphics[colorObj.param] = colorObj.color;
    if (colorObj.param === 'tableRowColor1' || colorObj.param === 'tableRowColor2' ||
      colorObj.param === 'tableTextColor') {
      this.settingsService.emitTableChangeEvent(colorObj);
    } else {
      this.settingsService.emitNavChangeEvent(colorObj);
    }
  }

  onSliderChanged($event) {
    this.val = $event.value;
  }
}
