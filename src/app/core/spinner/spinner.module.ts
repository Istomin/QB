import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SpinnerComponent }   from './spinner.component';
import { SpinnerService }   from './spinner.service';

@NgModule({
  exports: [SpinnerComponent],
  declarations: [SpinnerComponent],
  providers: [SpinnerService]
})
export class SpinnerModule {
  constructor( @Optional() @SkipSelf() parentModule: SpinnerModule) {

  }
}
