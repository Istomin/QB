import { Component, ViewChild, OnInit } from '@angular/core';
import { ColorPickerComponent } from '../color-picker'
import { Settings } from '../../models/settings.model';
import { AppSettingsService } from '../../core/app-settings.service';
import {LocalStorageService} from "../../core/local-storage.service";
import { GlobalVariable } from '../../core/global';
import {UserProfileService} from "../../core/user-profile.service";
import {Router} from "@angular/router";

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
  private name = 'aaa';
  private clonedSettings: {}&Settings;
  private dafaultSettings = GlobalVariable.SETTINGS;
  constructor(private settingsService: AppSettingsService, private localStorage: LocalStorageService, private userProfileService: UserProfileService, private router: Router,) { }

  public ngOnInit() {
    console.log(1)
    this.pageSettings = this.localStorage.getObject('userSettings') && this.localStorage.getObject('userSettings').hasOwnProperty('settings') ? this.localStorage.getObject('userSettings') : this.dafaultSettings;
    this.clonedSettings = this.deepCopy(this.pageSettings);
    this.onTextLogoChanged(this.pageSettings.settings.graphics.businessName);
  }

  public resetToPreviousSettings() {
    let array = [];
    this.pageSettings = this.clonedSettings;
    for (let key in this.pageSettings.settings.graphics) {
      if (key === 'businessName') {
        array.push({
          param: key,
          value: this.pageSettings.settings.graphics[key]
        });
      } else {
        array.push({
          param: key,
          color: this.pageSettings.settings.graphics[key]
        });
      }
    }
    array.forEach((obj) => {
      this.applySettings(obj);
    });
  }

  public saveSettings() {
    this.localStorage.setObject('userSettings', this.pageSettings);
  }

  private onColorChanged(colorObj) {
    this.pageSettings.settings.graphics[colorObj.param] = colorObj.color;
    this.applySettings(colorObj);
  }

  private applySettings(obj: any) {
    if (obj.param === 'tableRowColor1' || obj.param === 'tableRowColor2' ||
      obj.param === 'tableTextColor' || obj.param === 'tableHeaderColor') {
      this.settingsService.emitTableChangeEvent(obj);
    } else {
      this.settingsService.emitNavChangeEvent(obj);
    }
  }

  imageFinishedUploading(file: any) {
    console.log(JSON.stringify(file.serverResponse), file);
  }

  imageRemoved(file: any) {
    // do some stuff with the removed file.
  }

  uploadStateChange(state: boolean) {
    console.log(JSON.stringify(state));
  }
  private onSliderChanged($event) {
    this.val = $event.value;
  }

  private onTextLogoChanged($event) {
    this.settingsService.emitNavChangeEvent({
      param: 'businessName',
      value: $event
    });
  }

  private logout() {
    this.localStorage.set('token', '');
    this.userProfileService.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  private deepCopy(oldObj: any) {
    let newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
      newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
      for (let i in oldObj) {
        newObj[i] = this.deepCopy(oldObj[i]);
      }
    }
    return newObj;
  }
}
