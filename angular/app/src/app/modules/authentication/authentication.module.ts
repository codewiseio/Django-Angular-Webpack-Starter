import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { RequestOptions } from '@angular/http';
import { MaterialModule } from '../../material.module';

import { RegisterComponent } from './components/register.component';
import { UserActivationComponent } from './components/user-activation.component';
import { LoginComponent } from './components/login.component';
import { ResetPasswordComponent } from './components/reset-password.component';
import { ResetPasswordRequestComponent } from './components/reset-password-request.component';

import { UniqueEmailValidatorDirective } from './validators/unique-email-validator.directive';
import { ConfirmPasswordValidatorDirective } from './validators/confirm-password-validator.directive';

 
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthRequestOptions } from './authentication-request';
 
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
  ],
  declarations: [
    RegisterComponent,
    ResetPasswordComponent,
    ResetPasswordRequestComponent,
    UserActivationComponent,
    LoginComponent,
    ConfirmPasswordValidatorDirective,
    UniqueEmailValidatorDirective,
  ],
  providers: [ 
    AuthenticationService,
    {
      provide: RequestOptions, 
      useClass: AuthRequestOptions
    }
  ]
  
})
export class AuthenticationModule {}