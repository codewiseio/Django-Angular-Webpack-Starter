import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { RegisterComponent } from './register.component';
import { UserActivationComponent } from './user-activation.component';
import { LoginComponent } from './login.component';
import { ResetPasswordComponent } from './reset-password.component';

import { UniqueEmailValidatorDirective } from './validators/unique-email-validator.directive';
import { ConfirmPasswordValidatorDirective } from './validators/confirm-password-validator.directive';

 
import { UserService } from '../../services/user.service';

import { AuthenticationRoutingModule } from './authentication-routing.module';

 
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
    UserActivationComponent,
    LoginComponent,

    ConfirmPasswordValidatorDirective,
    UniqueEmailValidatorDirective,
  ],
  providers: [ UserService ]
})
export class AuthenticationModule {}