import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { RegisterComponent } from './components/register.component';
import { UserActivationComponent } from './components/user-activation.component';
import { LoginComponent } from './components/login.component';
import { ResetPasswordRequestComponent } from './components/reset-password-request.component';
import { ResetPasswordComponent } from './components/reset-password.component';
 
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordRequestComponent },
  { path: 'reset-password/:key', component: ResetPasswordComponent },
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