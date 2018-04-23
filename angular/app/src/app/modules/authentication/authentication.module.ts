import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { RequestOptions } from '@angular/http';

import {
  MatButtonModule,
  MatDialogModule,
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
import { LogoutComponent } from './components/logout.component';
import { ModifyCredentialsComponent } from './components/modify-credentials.component';

import { ResetPasswordComponent } from './components/reset-password.component';
import { ResetPasswordRequestComponent } from './components/reset-password-request.component';

import { ConfirmPasswordDialogComponent } from './components/confirm-password-dialog.component';

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
    MatDialogModule,
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
    LogoutComponent,
    ModifyCredentialsComponent,
    ConfirmPasswordDialogComponent,
    ConfirmPasswordValidatorDirective,
    UniqueEmailValidatorDirective,
  ],
  providers: [ 
    AuthenticationService,

    /* Adds the Authorization: Bearer xxxxx http header to every request */
    {
      provide: RequestOptions, 
      useClass: AuthRequestOptions
    }
  ],
  entryComponents: [ConfirmPasswordDialogComponent]
  
})
export class AuthenticationModule {

  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: CreditCardModule,
  //     providers: [CreditCardService]
  //   }
  // }

}