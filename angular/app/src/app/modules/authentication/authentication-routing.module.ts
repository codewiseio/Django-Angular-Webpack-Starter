import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { RegisterComponent } from './register.component';
import { UserActivationComponent } from './user-activation.component';
import { LoginComponent } from './login.component';
import { ResetPasswordComponent } from './reset-password.component';
 
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'activate/:key', component: UserActivationComponent }
];

 
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthenticationRoutingModule { }