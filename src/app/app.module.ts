import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import { ModalModule, TabsModule  } from 'ngx-bootstrap';
import { ColorPickerModule } from 'angular2-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdSliderModule } from '@angular/material';
import { OrderModule  } from 'ngx-order-pipe';
import { ImageUploadModule } from "angular2-image-upload";
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { HeaderControlComponent } from './header-control';
import { AboutComponent } from './about';
import { DashboardComponent } from './dashboard';
import { InfoTableComponent } from './info-table';
import { RunningLineComponent } from './running-line';
import { NoContentComponent } from './no-content';
import { SettingsModalComponent } from './settings-modal';
import { ColorPickerComponent } from './settings-modal/color-picker';
import { SettingsTabsComponent } from './settings-modal/settings-tabs';
import { XLargeDirective } from './home/x-large';
import { LineDirective } from './running-line/line';
import { FullScreenComponent } from './header-control/full-screen';
import { AppSettingsService } from './core/app-settings.service';
import { ClockComponent } from './header-control/clock';
import { LoginModule } from './login/login.module';
import { UserProfileService } from './core/user-profile.service';
import { AuthGuard } from './core/auth-guard.service';
import { SpinnerModule } from './core/spinner/spinner.module';
import { LocalStorageService } from  './core/local-storage.service';
import { TableScrollerDirective } from './dashboard/table-scroller.directive';

import 'hammerjs';
import '../styles/styles.scss';
import '../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import {httpFactory} from "./core/http-factory";

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    DashboardComponent,
    HeaderControlComponent,
    InfoTableComponent,
    RunningLineComponent,
    NoContentComponent,
    SettingsModalComponent,
    SettingsTabsComponent,
    ColorPickerComponent,
    FullScreenComponent,
    LineDirective,
    ClockComponent,
    XLargeDirective,
    TableScrollerDirective
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    SpinnerModule,
    FormsModule,
    HttpModule,
    LoginModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    ColorPickerModule,
    MdSliderModule,
    BrowserAnimationsModule,
    OrderModule,
    ImageUploadModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    AuthGuard,
    UserProfileService,
    AppSettingsService,
    ENV_PROVIDERS,
    APP_PROVIDERS,
    { provide: 'Window', useValue: window },
    LocalStorageService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LocalStorageService]
    }
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues  = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
