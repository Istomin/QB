import { Directive, Renderer2, ElementRef, OnInit } from '@angular/core';
var jQuery = require("jquery");

@Directive({
  selector: 'line'
})
export class LineDirective {
  constructor(
    private renderer: Renderer2,
    private element: ElementRef
  ){

  }



  ngOnInit() {

    jQuery(this.element.nativeElement).find('.slider').show();
  }


}
