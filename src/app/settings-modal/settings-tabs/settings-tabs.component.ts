import { Component, ViewChild, OnInit } from '@angular/core';
import { ColorPickerComponent } from '../color-picker'
import { Settings } from '../../models/settings.model';
import { AppSettingsService } from '../../core/app-settings.service';

@Component({
  selector: 'settings-tabs',
  styleUrls: [ 'settings-tabs.component.scss'],
  templateUrl: './settings-tabs.component.html'
})
export class SettingsTabsComponent {
  private pageSettings: Settings;
  @ViewChild(ColorPickerComponent) colorPickerComponent: ColorPickerComponent;

  constructor(private settingsService: AppSettingsService) {
  }

  ngOnInit() {
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
          tableTextColor: '#f00',
          tableRowColor1: '#f00',
          tableRowColor2: '#f00',
          businessName: 'Your Business Name Here'
        }
      }
    }
  }

  onColorChanged(colorObj) {
    this.pageSettings.settings.graphics[colorObj.param] = colorObj.color;
    this.settingsService.emitNavChangeEvent(colorObj);
  }
}
