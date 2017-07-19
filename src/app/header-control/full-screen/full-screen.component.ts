import { Component } from '@angular/core';
// interface ActiveXObject {
//   new (s: string): any;
// }
@Component({
  selector: 'full-screen',
  styleUrls: [ 'full-screen.component.scss' ],
  template: '<a href="#" class="ico-full-screen" (click)="openFullScreen()">Full Screena</a>'
})
export class FullScreenComponent {
  public openFullScreen(): void {
    function requestFullScreen(element: any) {
      // Supports most browsers and their versions.
      let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen
        || element.mozRequestFullScreen || element.msRequestFullScreen;

      if (requestMethod) {
        requestMethod.call(element);
      } else if (window.hasOwnProperty('ActiveXObject')) {
         //let wscript = new ActiveXObject('WScript.Shell');
        // if (wscript !== null) {
        //   wscript.SendKeys('{F11}');
        // }
      }
    }
    let elem = document.body; // Make the body go full screen.
    requestFullScreen(elem);
  }
}
