import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { RequestOptions } from '@angular/http';

import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';

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
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSnackBarModule,

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
export class AuthenticationModule {

  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: CreditCardModule,
  //     providers: [CreditCardService]
  //   }
  // }

}