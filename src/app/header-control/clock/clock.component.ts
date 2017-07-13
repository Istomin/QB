import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'clock',
  template: '<div class="clock">Current time: {{dateObj | date :"short" }}</div>'
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
