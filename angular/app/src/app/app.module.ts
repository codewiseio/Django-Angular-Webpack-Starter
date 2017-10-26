import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule }    from '@angular/common/http';

import { MaterialModule } from './material.module';

import { UniqueEmailValidatorDirective } from './validators/unique-email-validator.directive';


import { AppComponent } from './app.component';
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';


/**
 * Import the the Interceptor that handles attaching the xsrf token header
 * when making calls to the Django backend during development. This is done 
 * because angular's default behaviour does not send the xsrf token when
 * making requests to another server. 
 */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DevHttpXsrfInterceptor } from './xsrf.interceptor';



const appRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UniqueEmailValidatorDirective
  ],
  bootstrap: [ AppComponent ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DevHttpXsrfInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
