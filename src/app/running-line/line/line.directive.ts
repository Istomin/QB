import { Directive, Renderer2, ElementRef } from '@angular/core';


@Directive({
  selector: 'line'
})
export class LineDirective {
  constructor(
    private renderer: Renderer2,
    private element: ElementRef
  ){}
}
