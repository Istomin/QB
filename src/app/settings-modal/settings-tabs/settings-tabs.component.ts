import { Component, ViewChild, OnInit } from '@angular/core';
import { ColorPickerComponent } from '../color-picker'
import { Settings } from '../../models/settings.model';

@Component({
  selector: 'settings-tabs',
  styleUrls: [ 'settings-tabs.component.scss'],
  templateUrl: './settings-tabs.component.html'
})
export class SettingsTabsComponent {
  private settings: Settings;
  @ViewChild(ColorPickerComponent) colorPickerComponent: ColorPickerComponent;

  constructor() {
  }

  ngOnInit() {
    this.settings = {
      graphics: {
        mainColors: {
          titleBackground: '#f00'
        }
      }
    };
  }

  onColorChanged(colorObj) {
    this.settings.graphics.mainColors[colorObj.param] = colorObj.color;
  }
}
