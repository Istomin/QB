import { Directive, Renderer2, ElementRef } from '@angular/core';
var jQuery = require("jquery");

@Directive({
  selector: '[scroller]'
})
export class TableScrollerDirective {
  private animSpeed: number = 15000;
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
      jQuery(this.element.nativeElement).animate({
        scrollTop: jQuery(this.element.nativeElement).scrollTop() + offset
      }, 500);
    }, 10000)
  }
}
