import { Directive, Renderer2, ElementRef } from '@angular/core';
var jQuery = require("jquery");

@Directive({
  selector: 'line'
})
export class LineDirective {
  private animSpeed: number = 15000;
  constructor(
    private renderer: Renderer2,
    private element: ElementRef
  ){

  }
  ngOnInit() {
    setTimeout(() => {
      this.startAnimation();
    }, 100);
  }

  public startAnimation() {
    jQuery(this.element.nativeElement).find('.slider').css({
      left: jQuery(this.element.nativeElement).width()
    }).stop().animate({
      left: - jQuery(this.element.nativeElement).find('.slider').width()
    }, {easing: 'linear', duration: this.animSpeed, complete: () => {
        this.startAnimation();
    }});
  }

}
