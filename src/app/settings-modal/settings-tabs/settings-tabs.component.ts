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
  private settings: Settings;
  @ViewChild(ColorPickerComponent) colorPickerComponent: ColorPickerComponent;

  constructor(private settingsService: AppSettingsService) {
  }

  ngOnInit() {
    this.settings = {
      graphics: {
        mainColors: {
          titleBackground: '#ee0',
          titleTextColor: '#fff'
        }
      }
    };
  }

  onColorChanged(colorObj) {
    this.settings.graphics.mainColors[colorObj.param] = colorObj.color;
    this.settingsService.emitNavChangeEvent(colorObj);
  }
}
