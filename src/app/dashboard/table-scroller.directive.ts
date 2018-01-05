import { Directive, Renderer2, ElementRef } from '@angular/core';
import { LocalStorageService } from '../core/local-storage.service';
import { AppSettingsService } from '../core/app-settings.service';
import { Subscription } from 'rxjs/Subscription';
var jQuery = require("jquery");

@Directive({
  selector: '[scroller]'
})
export class TableScrollerDirective {
  public subscription: Subscription;
  private animSpeed: number = 10000;
  private prevScrollOffset: number = -1;
  private startFlag: boolean = false;
  private timer: any;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private localStorage: LocalStorageService,
    private settingsService: AppSettingsService
  ){

  }
  ngOnInit() {
    this.subscription = this.settingsService.getScrollInterval().subscribe((interval) => {
      clearInterval(this.timer);
      this.startFlag = true;
      this.animSpeed = interval;
      this.startScrolling();
    });

    if(!this.startFlag) {
      setTimeout(() => {
        this.animSpeed =  this.localStorage.getObject('userSettings').hasOwnProperty('settings') && this.localStorage.getObject('userSettings').settings.system.scrollInterval * 1000 || 10000;
        this.startScrolling();
      }, 10000);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  startScrolling() {


    this.timer = setInterval(() => {
      var offset = jQuery('main').height() - 50; // get visible table part size
      let scrollTo = jQuery(this.element.nativeElement).scrollTop() + offset;
      if(scrollTo + offset - 1 > jQuery(this.element.nativeElement).find('tbody').height()) {
        scrollTo = 0;
      }
      jQuery(this.element.nativeElement).animate({
        scrollTop: scrollTo
      }, 500, () => {

      });
  }, this.animSpeed);
  }
}
