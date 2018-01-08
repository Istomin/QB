import { Directive, Renderer2, ElementRef, Input, EventEmitter } from '@angular/core';
import { LocalStorageService } from '../core/local-storage.service';
import { AppSettingsService } from '../core/app-settings.service';
import { Subscription } from 'rxjs/Subscription';
var jQuery = require("jquery");

@Directive({
  selector: '[scroller]'
})
export class TableScrollerDirective {

  @Input() scrollerApi: {
    getScrollToOffsetData: (offset) => {
      visibleHeight: number,
      hidenHeight: number
    };
  };

  public subscription: Subscription;
  private prevScrollOffset: number = -1;
  private startFlag: boolean = false;
  private timer: any;
  private lastScrollPosition: number;
  private _componentApi: any;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private localStorage: LocalStorageService,
    private settingsService: AppSettingsService
  ) {

  }
  ngOnInit() {

    this.subscription = this.settingsService.getScrollInterval().subscribe((interval) => {
      clearInterval(this.timer);
      this.startFlag = true;
      this.lastScrollPosition = 0;

      this.scrollWithInterval();
    });

    if (!this.startFlag) {
      setTimeout(() => {

        this.scrollWithInterval();
      }, 10000);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAnimationSpeed() {
    return this.localStorage.getObject('userSettings').hasOwnProperty('settings') && this.localStorage.getObject('userSettings').settings.system.scrollInterval * 1000 || 10000;
  }

  scrollWithInterval() {

    this.timer = setTimeout(() => {

      let offset = 0;
      let mainElementHeight = jQuery('main').height() - 50;

      let element = this.element.nativeElement;

      let scrollTo = 0;
      if (this.scrollerApi && this.scrollerApi.getScrollToOffsetData) {
        let scrollData = this.scrollerApi.getScrollToOffsetData(mainElementHeight);
        if (scrollData.hidenHeight){
          scrollTo = scrollData.hidenHeight + scrollData.visibleHeight;
        }
        else{
          scrollTo = scrollData.visibleHeight;
        }
      }
      scrollTo = scrollTo || jQuery(element).scrollTop() + offset;

      if (this.lastScrollPosition === scrollTo) {
        scrollTo = 0;
      }

      this.lastScrollPosition = scrollTo;

      jQuery(this.element.nativeElement).animate({
        scrollTop: scrollTo
      }, 500, () => {
        this.scrollWithInterval();
      });

    }, this.getAnimationSpeed())

  }

}
