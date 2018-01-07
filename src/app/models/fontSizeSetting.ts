export class FontSizeSetting {
    constructor(public min: number, public max: number, public base: number) {
      if (this.min > this.max) {
        let buff = this.max;
        this.max = this.min;
        this.min = buff;
      }
      if (this.base < this.min) {
        this.base = this.min;
      }
      if (this.base > this.max) {
        this.base = this.max;
      }
    }
  }
  