import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'clock',
  template: '<span class="clock">Current time: {{dateObj | date :"dd.MM hh:mm" }}</span>'
})
export class ClockComponent implements OnInit {
  public dateObj;
  public ngOnInit() {
    this.updateDate();
  }
  private updateDate() {

    setInterval(() => {
      this.dateObj = new Date();
    }, 500);
  }
}
