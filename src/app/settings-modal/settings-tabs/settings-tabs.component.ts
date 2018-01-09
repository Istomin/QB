import { Component, ViewChild, OnInit } from '@angular/core';
import { ColorPickerComponent } from '../color-picker'
import { Settings } from '../../models/settings.model';
import { AppSettingsService } from '../../core/app-settings.service';
import { LocalStorageService } from "../../core/local-storage.service";
import { GlobalVariable } from '../../core/global';
import { UserProfileService } from "../../core/user-profile.service";
import { Router } from "@angular/router";
import { LoginService } from "../../login/login.service";
import { UploadService } from "../../core/upload.service";
var jQuery = require("jquery");

enum transit {
  PU = <any>'From Collection',
  PO = <any>'From Pack Out',
  AL = <any>'From Alternate'
}

enum ETANote {
  PU = <any>'From Collection',
  PO = <any>'From Pack Out',
  AL = <any>'From Alternate'
}

@Component({
  selector: 'settings-tabs',
  styleUrls: ['settings-tabs.component.scss'],
  templateUrl: './settings-tabs.component.html'
})
export class SettingsTabsComponent implements OnInit {

  @ViewChild(ColorPickerComponent) public colorPickerComponent: ColorPickerComponent;

  private fontSizes = GlobalVariable.SETTINGS.settings.fontSizes;
  public runTextHolderValue: number = this.fontSizes.runTextHolder.base;
  public headerClockValue: number = this.fontSizes.headerClock.base;
  public headerLogoValue: number = this.fontSizes.headerLogo.base;
  public tableBodyTdValue: number = this.fontSizes.tBodyTd.base;
  public tableHeaderThValue: number = this.fontSizes.tHeadTh.base;

  private pageSettings: Settings;
  private minRefreshInterval: number = 10;
  private minScrollInterval: number = 10;
  private maxRefreshInterval: number = 30;
  private maxScrollInterval: number = 60;

  private step: number = 1;
  private refresh_int: number = 10;
  private scroll_int: number = 10;
  private name = 'aaa';
  private clonedSettings: {} & Settings;
  private baseUrl = GlobalVariable.BASE_URL;
  private dafaultSettings = GlobalVariable.SETTINGS;
  private displayShipper;
  private displayConsignee;
  private numberOfSigns = 99;

  private flightDisplay;
  private dropDelivered;
  private showTransit;
  private showExpectedDelivery;
  private imgSrc: string;
  private user: {} | any;
  private newLogoAdded: boolean;
  private file: any;
  private isLogoRemoved: boolean;
  userInfo: any;
  private selectedTransitOption: any;
  private transitArrayNames: [transit, transit, transit];
  private show_transit: any;
  private prevTransitOption: any;
  constructor(private settingsService: AppSettingsService, private localStorage: LocalStorageService, private userProfileService: UserProfileService, private router: Router, private loginService: LoginService, private uploadService: UploadService) {
  }

  public ngOnInit() {
    this.transitArrayNames = [transit.PU, transit.PO, transit.AL];
    this.pageSettings = this.localStorage.getObject('userSettings') && this.localStorage.getObject('userSettings').hasOwnProperty('settings') ? this.localStorage.getObject('userSettings') : this.dafaultSettings;
    this.displayShipper = true;
    this.displayConsignee = true;
    this.flightDisplay = {};
    this.dropDelivered = {};
    this.showTransit = {};
    this.showExpectedDelivery = {};
    this.selectedTransitOption = this.transitArrayNames[0];
    this.show_transit = transit[this.selectedTransitOption];
    this.loginService.getUserInfo().subscribe((response: any) => {
      this.userInfo = JSON.parse(response['_body']);
      this.settingsService.emitUserSettingsData(this.userInfo);

      let settings = this.pageSettings.settings;
      settings.graphics.businessName = this.userInfo.business_name;
      settings.system.refreshInterval = this.userInfo.refresh_int == 0 ? 10 : this.userInfo.refresh_int;
      settings.system.scrollInterval = this.userInfo.scroll_int * 10;
      settings.system.displayConsignee = this.userInfo.display_mode == 'consignee' || this.userInfo.display_mode == 'both';
      settings.system.displayShipper = this.userInfo.display_mode == 'shipper' || this.userInfo.display_mode == 'both';
      settings.system.flightDisplay = this.userInfo.flight_display == 'org' ? 0 : 1;
      settings.system.dropDelivered = this.userInfo.drop_delivered;
      settings.system.showTransit = this.userInfo.show_transit;
      settings.system.showExpectedDelivery = this.userInfo.show_expect_delivery;

      this.tableBodyTdValue = settings.fontSizes.tBodyTd;
      this.tableHeaderThValue = settings.fontSizes.tHeadTh;
      this.headerClockValue = settings.fontSizes.headerClock;
      this.headerLogoValue = settings.fontSizes.headerLogo;
      this.runTextHolderValue = settings.fontSizes.runTextHolder;
      this.numberOfSigns = settings.system.numberOfSigns;

      this.refresh_int = settings.system.refreshInterval;
      this.scroll_int = settings.system.scrollInterval / 10;
      this.displayConsignee = settings.system.displayConsignee;
      this.displayShipper = settings.system.displayShipper;


      this.flightDisplay['model'] = settings.system.flightDisplay;
      this.dropDelivered['model'] = settings.system.dropDelivered;
      
      this.showTransit['model'] = settings.system.showTransit;
      this.showExpectedDelivery['model'] = settings.system.showExpectedDelivery;
      this.selectedTransitOption = transit[this.userInfo.show_transit];
      this.settingsService.emitTableCol(this.pageSettings);
      this.clonedSettings = this.deepCopy(this.pageSettings);
      this.onTextLogoChanged(this.pageSettings.settings.graphics.businessName);
      this.settingsService.emitRefreshInterval(settings.system.refreshInterval);
      this.settingsService.emitAlertsSettingsChange(settings.alerts);
    });
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

    this.displayConsignee = this.pageSettings.settings.system.displayConsignee;
    this.displayShipper = this.pageSettings.settings.system.displayShipper;

    this.numberOfSigns  = this.pageSettings.settings.system.numberOfSigns;
    this.flightDisplay['model'] = this.pageSettings.settings.system.flightDisplay;
    this.dropDelivered['model'] = this.pageSettings.settings.system.dropDelivered;
    this.showTransit['model'] = this.pageSettings.settings.system.showTransit;
    this.showTransit['showExpectedDelivery'] = this.pageSettings.settings.system.showExpectedDelivery;
    this.settingsService.emitTableCol(this.pageSettings);
    this.settingsService.emitAlertsSettingsChange(this.clonedSettings.settings.alerts);
    array.forEach((obj) => {
      this.applySettings(obj);
    });

    this.isLogoRemoved = false;
  }

  public saveSettings() {
    this.prepareUserSettingsForSaving();

    this.pageSettings.settings.system.numberOfSigns = this.numberOfSigns;

    this.settingsService.emitFontSizeChange(this.pageSettings.settings.fontSizes);
    this.settingsService.emitScrollInterval(this.pageSettings.settings.system.scrollInterval);
    this.settingsService.emitRefreshInterval(this.pageSettings.settings.system.refreshInterval);

    if (this.isLogoRemoved) {
      this.uploadService.removeLogo().subscribe((response) => {
        this.settingsService.emitLogoId({
          isDeleted: true
        });
        this.updateUser();
        this.imgSrc = null;
      });
    } else {
      if (this.newLogoAdded) {
        this.uploadService.uploadLogo(this.file).subscribe((response) => {
          this.updateUser();
        });
      } else {
        this.updateUser();
      }
    }

    this.localStorage.setObject('userSettings', this.pageSettings);
  }

  public getSettings() {
    this.userInfo = this.localStorage.getObject('user');
    if (this.localStorage.getObject('userSettings').hasOwnProperty('settings')) {
      this.pageSettings = this.localStorage.getObject('userSettings');
      this.clonedSettings = this.deepCopy(this.pageSettings);
      this.prevTransitOption = this.userInfo.show_transit;
    }

    if (this.userInfo.logo) {
      this.imgSrc = this.baseUrl + this.userInfo.logo;
    }
  }

  private updateUser() {
    let current = this.userInfo.show_transit;
    this.localStorage.setObject('user', this.userInfo);
    delete this.userInfo.logo;
    this.loginService.updateUserInfo(this.userInfo).subscribe((response: any) => {
      if (current != this.prevTransitOption) {
        this.settingsService.emitTableDataChange();
      }
    });
  }

  private prepareUserSettingsForSaving() {
    console.log('prepareUserSettingsForSaving');
    this.pageSettings.settings.system.refreshInterval = this.refresh_int;
    this.pageSettings.settings.system.scrollInterval = this.scroll_int;
    this.pageSettings.settings.system.displayConsignee = this.displayConsignee;
    this.pageSettings.settings.system.displayShipper = this.displayShipper;
    
    this.pageSettings.settings.system.flightDisplay = this.flightDisplay['model'];
    this.pageSettings.settings.system.dropDelivered = this.dropDelivered['model'];
    this.pageSettings.settings.system.showTransit = this.showTransit['model'];
    this.pageSettings.settings.system.showExpectedDelivery = this.showExpectedDelivery['model'];

    this.pageSettings.settings.fontSizes = {
      tBodyTd: this.tableBodyTdValue,
      tHeadTh: this.tableHeaderThValue,
      headerClock: this.headerClockValue,
      headerLogo: this.headerLogoValue,
      runTextHolder: this.runTextHolderValue
    };

    this.collectUserSettings();
  }

  private collectUserSettings() {
    this.userInfo.business_name = this.pageSettings.settings.graphics.businessName;

    this.userInfo.drop_delivered = this.pageSettings.settings.system.dropDelivered;
    this.userInfo.flight_display = this.pageSettings.settings.system.flightDisplay == 0 ? 'org' : 'des';
    this.userInfo.show_expect_delivery = this.pageSettings.settings.system.showExpectedDelivery;
    this.userInfo.refresh_int = this.pageSettings.settings.system.refreshInterval;
    this.userInfo.scroll_int = this.pageSettings.settings.system.scrollInterval;

    let displayShipper = this.pageSettings.settings.system.displayShipper;

    let displayConsignee = this.pageSettings.settings.system.displayConsignee;

    if (displayShipper && displayConsignee) {
      this.userInfo.display_mode = 'both'
    }
    else {
      if (displayShipper) {
        this.userInfo.display_mode = 'shipper'
      }
      if (displayConsignee) {
        this.userInfo.display_mode = 'consignee'
      }
    }

    this.userInfo.show_transit = this.showTransit['model'] ? this.show_transit : null;

  }

  private onTableColChange() {
    let system = this.pageSettings.settings.system;
    system.displayShipper = this.displayShipper;
    system.displayConsignee = this.displayConsignee;
    system.flightDisplay = this.flightDisplay['model'];
    system.dropDelivered = this.dropDelivered['model'];
    system.showTransit = this.showTransit['model'];
    system.showExpectedDelivery = this.showExpectedDelivery['model'];
    this.settingsService.emitTableCol(this.pageSettings);
  }

  private onColorChanged(colorObj) {
    this.pageSettings.settings.graphics[colorObj.param] = colorObj.color;
    this.applySettings(colorObj);
  }

  onAlertColorChanged(obj) {
    if (obj) {
      this.pageSettings.settings.alerts[obj.param] = obj.color;
    }
    setTimeout(() => {
      this.settingsService.emitAlertsSettingsChange(this.pageSettings.settings.alerts);
    }, 300);
  }

  onChange(event) {
    let reader = new FileReader();
    var target = event.target || event.srcElement;
    this.file = target.files[0];
    reader.onload = () => {
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
  };

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

  onTransitSelectChange(event) {
    this.selectedTransitOption = event.target.value;
    this.show_transit = transit[this.selectedTransitOption];
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
