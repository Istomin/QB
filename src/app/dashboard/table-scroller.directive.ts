import { Directive, Renderer2, ElementRef } from '@angular/core';
var jQuery = require("jquery");

@Directive({
  selector: '[scroller]'
})
export class TableScrollerDirective {
  private animSpeed: number = 15000;
  private prevScrollOffset: number = -1;
  constructor(
    private renderer: Renderer2,
    private element: ElementRef
  ){

  }
  ngOnInit() {
    setTimeout(() => {
      var offset = parseInt(jQuery(this.element.nativeElement).find('table').height() / 40);
      this.startScrolling(offset);
    }, 10000)
  }

  startScrolling(offset) {
    setInterval(() => {

      let scrollTo = jQuery(this.element.nativeElement).scrollTop() + offset;

      if(this.prevScrollOffset == jQuery(this.element.nativeElement).scrollTop()) {
        scrollTo = 0;
      }

      jQuery(this.element.nativeElement).animate({
        scrollTop: scrollTo
      }, 500, () => {

      });


      setTimeout(() => {
        console.log(offset, jQuery(this.element.nativeElement).scrollTop(), jQuery(this.element.nativeElement).find('table').height())
      }, 800)
    }, 1000)
  }
}
