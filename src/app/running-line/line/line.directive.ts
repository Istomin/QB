import { Directive, Renderer2, ElementRef } from '@angular/core';
var jQuery = require("jquery");

@Directive({
  selector: 'line'
})
export class LineDirective {
  private animSpeed: number = 20000;
  constructor(
    private renderer: Renderer2,
    private element: ElementRef
  ){

  }
  ngOnInit() {
    // setTimeout(() => {
    //   this.startAnimation();
    // }, 100);
  }

  public startAnimation() {
      console.log(  jQuery(this.element.nativeElement).find('.slider').width())
      console.log( jQuery(window).width())
    jQuery(this.element.nativeElement).find('.slider').css({
      left: jQuery(this.element.nativeElement).width()
    }).stop().animate({
      left: - jQuery(this.element.nativeElement).find('.slider').width()
    }, {easing: 'linear', queue: false, duration: this.animSpeed, complete: () => {
        this.startAnimation();
    }});
  }

}
