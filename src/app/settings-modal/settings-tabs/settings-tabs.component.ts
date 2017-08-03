import {Component, ViewChild, OnInit} from '@angular/core';
import {ColorPickerComponent} from '../color-picker'
import {Settings} from '../../models/settings.model';
import {AppSettingsService} from '../../core/app-settings.service';
import {LocalStorageService} from "../../core/local-storage.service";
import {GlobalVariable} from '../../core/global';
import {UserProfileService} from "../../core/user-profile.service";
import {Router} from "@angular/router";
import {LoginService} from  "../../login/login.service";

@Component({
  selector: 'settings-tabs',
  styleUrls: ['settings-tabs.component.scss'],
  templateUrl: './settings-tabs.component.html'
})
export class SettingsTabsComponent implements OnInit {

  @ViewChild(ColorPickerComponent) public colorPickerComponent: ColorPickerComponent;
  private pageSettings: Settings;
  private minRefreshInterval: number = 10;
  private minScrollInterval: number = 10;
  private maxRefreshInterval: number = 30;
  private maxScrollInterval: number = 60;
  private step: number = 1;
  private refresh_int: number = 10;
  private scroll_int: number = 10;
  private name = 'aaa';
  private clonedSettings: {}&Settings;
  private dafaultSettings = GlobalVariable.SETTINGS;
  private displayMode;
  private flightDisplay;

  constructor(private settingsService: AppSettingsService, private localStorage: LocalStorageService, private userProfileService: UserProfileService, private router: Router, private loginService: LoginService) {
  }

  public ngOnInit() {
    this.pageSettings = this.localStorage.getObject('userSettings') && this.localStorage.getObject('userSettings').hasOwnProperty('settings') ? this.localStorage.getObject('userSettings') : this.dafaultSettings;
    this.displayMode = {};
    this.flightDisplay = {};
    this.loginService.getUserInfo().subscribe((response: any) => {
      this.settingsService.emitUserSettingsData(response['_body']);
    });

    this.refresh_int =  this.pageSettings.settings.system.refreshInterval;
    this.scroll_int = this.pageSettings.settings.system.scrollInterval;
    this.displayMode['model'] = this.pageSettings.settings.system.displayMode;
    this.flightDisplay['model'] = this.pageSettings.settings.system.flightDisplay;
    this.settingsService.emitTableCol(this.pageSettings);

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

    this.displayMode['model'] = this.pageSettings.settings.system.displayMode;
    this.flightDisplay['model'] = this.pageSettings.settings.system.flightDisplay;
    this.settingsService.emitTableCol(this.pageSettings);
    array.forEach((obj) => {
      this.applySettings(obj);
    });
  }

  public saveSettings() {
    this.prepareUserSettingsForSaving();
    this.settingsService.emitScrollInterval(this.pageSettings.settings.system.scrollInterval);
    this.localStorage.setObject('userSettings', this.pageSettings);
  }

  private prepareUserSettingsForSaving() {
    this.pageSettings.settings.system.refreshInterval =  this.refresh_int;
    this.pageSettings.settings.system.scrollInterval = this.scroll_int;
    this.pageSettings.settings.system.displayMode = this.displayMode['model'];
    this.pageSettings.settings.system.flightDisplay = this.flightDisplay['model'];
  }

  private onTableColChange() {
    this.pageSettings.settings.system.displayMode = this.displayMode['model'];
    this.pageSettings.settings.system.flightDisplay = this.flightDisplay['model'];
    this.settingsService.emitTableCol(this.pageSettings);
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
    let fileObj = JSON.parse(file.serverResponse['_body']),
      splittedString = fileObj.file.split('/'),
      imgId = splittedString[splittedString.length - 1];
    this.settingsService.emitLogoId(imgId);
  }

  imageRemoved(file: any) {
    // do some stuff with the removed file.
  }

  uploadStateChange(state: boolean) {
    console.log(JSON.stringify(state));
  }

  private onRefreshSliderChanged($event) {
    this.refresh_int = $event.value;
  }

  private onScrollSliderChanged($event) {
    this.scroll_int = $event.value;
  }

  private onTextLogoChanged($event) {
    this.pageSettings.settings.graphics.businessName = $event;
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
