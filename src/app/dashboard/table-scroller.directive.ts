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
      this.animSpeed = interval * 1000;
      this.startScrolling();
    });

    if(!this.startFlag) {
      setTimeout(() => {
        this.animSpeed =  this.localStorage.getObject('userSettings').settings.system.scrollInterval * 1000;
        this.startScrolling();
      }, 10000);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  startScrolling() {
    var offset = Math.round(jQuery(this.element.nativeElement).find('table').height() / 40);
    this.timer = setInterval(() => {
      let scrollTo = jQuery(this.element.nativeElement).scrollTop() + offset;
      if(scrollTo + 700 > jQuery(this.element.nativeElement).find('table').height()) {
        scrollTo = 0;
      }
      jQuery(this.element.nativeElement).stop().animate({
        scrollTop: scrollTo
      }, 500, () => {

      });
    }, this.animSpeed);
  }
}
