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
  private clonedSettings: {}&Settings;
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
          titleBackground: '#555',
          titleTextColor: '#fff',
          tableHeaderColor: '#016c8f',
          tableTextColor: '#fff',
          tableRowColor1: '#f00',
          tableRowColor2: '#00325d',
          businessName: 'Your Business Name Here'
        }
      }
    };

    this.clonedSettings = this.deepCopy(this.pageSettings);
  }

  private onColorChanged(colorObj) {
    this.pageSettings.settings.graphics[colorObj.param] = colorObj.color;
    this.applySettings(colorObj);
  }

  applySettings(obj: any) {
    if (obj.param === 'tableRowColor1' || obj.param === 'tableRowColor2' ||
      obj.param === 'tableTextColor' || obj.param === 'tableHeaderColor') {
      this.settingsService.emitTableChangeEvent(obj);
    } else {
      this.settingsService.emitNavChangeEvent(obj);
    }
  }

  onSliderChanged($event) {
    this.val = $event.value;
  }

  resetToPreviousSettings() {
    let array = [];
    this.pageSettings = this.clonedSettings;
    for(let key in this.pageSettings.settings.graphics) {
      array.push({
        param: key,
        color: this.pageSettings.settings.graphics[key]
      });
    }
    array.forEach((obj) => {
      this.applySettings(obj);
    });
  }

  public deepCopy(oldObj: any) {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === "object") {
      newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
      for (var i in oldObj) {
        newObj[i] = this.deepCopy(oldObj[i]);
      }
    }
    return newObj;
  }
}
