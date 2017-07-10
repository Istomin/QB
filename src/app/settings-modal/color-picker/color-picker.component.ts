import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'color-picker',
  styleUrls: [ 'color-picker.component.scss'],
  templateUrl: './color-picker.component.html'
})
export class ColorPickerComponent {
  @Input() color: string;
  @Input() param: string;
  @Output() changed: EventEmitter<{}>;
  componentColor: string;

  constructor() {
    this.changed = new EventEmitter<string>();
    this.componentColor = this.color;
  }
  onColorChanged(event) {
    this.color = event;
    this.changed.emit({color: event, param: this.param});
  }

}
