import { Directive, Renderer2, ElementRef } from '@angular/core';
import { LocalStorageService } from '../core/local-storage.service';
var jQuery = require("jquery");

@Directive({
  selector: '[scroller]'
})
export class TableScrollerDirective {
  private animSpeed: number = 10000;
  private prevScrollOffset: number = -1;
  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private localStorage: LocalStorageService
  ){

  }
  ngOnInit() {
    setTimeout(() => {
      this.animSpeed =  this.localStorage.getObject('userSettings').settings.system.scrollInterval * 1000;
      var offset = Math.round(jQuery(this.element.nativeElement).find('table').height() / 40);
      this.startScrolling(offset);
    }, 10000);
  }

  ngOnDestroy(){

  }

  startScrolling(offset) {
    setInterval(() => {

      let scrollTo = jQuery(this.element.nativeElement).scrollTop() + offset;

      if(scrollTo + 700 > jQuery(this.element.nativeElement).find('table').height()) {
        scrollTo = 0;
      }

      jQuery(this.element.nativeElement).animate({
        scrollTop: scrollTo
      }, 500, () => {

      });
    }, this.animSpeed);
  }
}
