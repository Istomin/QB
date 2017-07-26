import { NgModule } from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { LoginRoutingModule, routedComponents } from './login-routing.module';
import { SpinnerModule } from '.././core/spinner/spinner.module';
@NgModule({
  imports: [LoginRoutingModule, SpinnerModule],
  declarations: [routedComponents]
})
export class LoginModule { }
