import { NgModule } from '@angular/core';

import { LoginRoutingModule, routedComponents } from './login-routing.module';

@NgModule({
  imports: [LoginRoutingModule],
  declarations: [routedComponents]
})
export class LoginModule { }
