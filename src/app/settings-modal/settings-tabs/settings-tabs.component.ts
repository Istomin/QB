import {Component, ViewChild, OnInit} from '@angular/core';
import {ColorPickerComponent} from '../color-picker'
import {Settings} from '../../models/settings.model';
import {AppSettingsService} from '../../core/app-settings.service';
import {LocalStorageService} from "../../core/local-storage.service";
import {GlobalVariable} from '../../core/global';
import {UserProfileService} from "../../core/user-profile.service";
import {Router} from "@angular/router";
import {LoginService} from  "../../login/login.service";
import {UploadService} from  "../../core/upload.service";
var jQuery = require("jquery");
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
  private baseUrl = GlobalVariable.BASE_URL;
  private dafaultSettings = GlobalVariable.SETTINGS;
  private displayMode;
  private flightDisplay;
  private dropDelivered;
  private showTransit;
  private showExpectedDelivery;
  private imgSrc: string;
  private user: {}|any;
  private newLogoAdded: boolean;
  private file: any;
  private isLogoRemoved: boolean;
  constructor(private settingsService: AppSettingsService, private localStorage: LocalStorageService, private userProfileService: UserProfileService, private router: Router, private loginService: LoginService, private uploadService: UploadService) {
  }

  public ngOnInit() {

    this.pageSettings = this.localStorage.getObject('userSettings') && this.localStorage.getObject('userSettings').hasOwnProperty('settings') ? this.localStorage.getObject('userSettings') : this.dafaultSettings;
    this.displayMode = {};
    this.flightDisplay = {};
    this.dropDelivered = {};
    this.showTransit = {};
    this.showExpectedDelivery = {};
    this.loginService.getUserInfo().subscribe((response: any) => {
      this.settingsService.emitUserSettingsData(response['_body']);
    });

    this.refresh_int =  this.pageSettings.settings.system.refreshInterval;
    this.scroll_int = this.pageSettings.settings.system.scrollInterval;
    this.displayMode['model'] = this.pageSettings.settings.system.displayMode;
    this.flightDisplay['model'] = this.pageSettings.settings.system.flightDisplay;
    this.dropDelivered['model'] = this.pageSettings.settings.system.dropDelivered;
    this.showTransit['model'] = this.pageSettings.settings.system.showTransit;
    this.showExpectedDelivery['model'] = this.pageSettings.settings.system.showExpectedDelivery;
    this.settingsService.emitTableCol(this.pageSettings);

    this.clonedSettings = this.deepCopy(this.pageSettings);
    this.onTextLogoChanged(this.pageSettings.settings.graphics.businessName);
    // this.uploadService.test().subscribe();
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
    this.settingsService.emitLogoId({
      isCanceled: true
    });
    this.displayMode['model'] = this.pageSettings.settings.system.displayMode;
    this.flightDisplay['model'] = this.pageSettings.settings.system.flightDisplay;
    this.dropDelivered['model'] = this.pageSettings.settings.system.dropDelivered;
    this.showTransit['model'] = this.pageSettings.settings.system.showTransit;
    this.showTransit['showExpectedDelivery'] = this.pageSettings.settings.system.showExpectedDelivery;
    this.settingsService.emitTableCol(this.pageSettings);
    array.forEach((obj) => {
      this.applySettings(obj);
    });

    this.isLogoRemoved = false;
  }

  public saveSettings() {
    this.prepareUserSettingsForSaving();
    this.settingsService.emitScrollInterval(this.pageSettings.settings.system.scrollInterval);
    this.localStorage.setObject('userSettings', this.pageSettings);
    if(this.isLogoRemoved) {
      this.uploadService.removeLogo().subscribe((response) => {
        this.settingsService.emitLogoId({
          isDeleted: true
        });
        this.imgSrc = null;
      });
    } else {
      if(this.newLogoAdded) {
        this.uploadService.uploadLogo(this.file).subscribe((response) => {

        });
      }
    }
  }

  public getSettings() {
    this.user = this.localStorage.getObject('user');
    console.log(this.user, 'this.user')
    if(this.user.logo) {
      this.imgSrc = this.baseUrl + this.user.logo;
    }
  }

  private prepareUserSettingsForSaving() {
    this.pageSettings.settings.system.refreshInterval =  this.refresh_int;
    this.pageSettings.settings.system.scrollInterval = this.scroll_int;
    this.pageSettings.settings.system.displayMode = this.displayMode['model'];
    this.pageSettings.settings.system.flightDisplay = this.flightDisplay['model'];
    this.pageSettings.settings.system.dropDelivered = this.dropDelivered['model'];
    this.pageSettings.settings.system.showTransit = this.showTransit['model'];
    this.pageSettings.settings.system.showExpectedDelivery = this.showExpectedDelivery['model'];
  }

  private onTableColChange() {
    this.pageSettings.settings.system.displayMode = this.displayMode['model'];
    this.pageSettings.settings.system.flightDisplay = this.flightDisplay['model'];
    this.pageSettings.settings.system.dropDelivered = this.dropDelivered['model'];
    this.pageSettings.settings.system.showTransit = this.showTransit['model'];
    this.pageSettings.settings.system.showExpectedDelivery = this.showExpectedDelivery['model'];
    this.settingsService.emitTableCol(this.pageSettings);
  }

  private onColorChanged(colorObj) {
    this.pageSettings.settings.graphics[colorObj.param] = colorObj.color;
    this.applySettings(colorObj);
  }
  onChange(event) {
    console.log(event, 'eventeventevent')
    let  reader = new FileReader();
    this.file = event.srcElement.files[0];
    reader.onload = () =>{
      this.imgSrc = reader.result;
      this.settingsService.emitLogoId({
        isAdded: true,
        logoId: this.imgSrc
      });
      this.newLogoAdded = true;
      this.isLogoRemoved = false;
    };
    reader.readAsDataURL(this.file);

  }
  private applySettings(obj: any) {
    if (obj.param === 'tableRowColor1' || obj.param === 'tableRowColor2' ||
      obj.param === 'tableTextColor' || obj.param === 'tableHeaderColor') {
      this.settingsService.emitTableChangeEvent(obj);
    } else {
      this.settingsService.emitNavChangeEvent(obj);
    }
  }


  private onRefreshSliderChanged($event) {
    this.refresh_int = $event.value;
  }

  private onScrollSliderChanged($event) {
    this.scroll_int = $event.value;
  }

  private removeLogo() {
    this.imgSrc = null;
    this.isLogoRemoved = true;
    jQuery("#file-upload")[0].value = "";
    this.settingsService.emitLogoId({
      isRemoved: true
    });
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
