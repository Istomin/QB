import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { LoginRoutingModule, routedComponents } from './login-routing.module';
import { SpinnerModule } from '.././core/spinner/spinner.module';
import { LoginService } from './login.service';
@NgModule({
  imports: [LoginRoutingModule, SpinnerModule, FormsModule, CommonModule],
  declarations: [routedComponents],
  providers: [ LoginService ]
})
export class LoginModule { }
