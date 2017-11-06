import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule }    from '@angular/common/http';

import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';

/** 
 * Authentication Module
 * Contains components for user registration and authentication
 */
import { AuthenticationModule } from './modules/authentication/authentication.module';

/* Interceptor sends JWT Token on all requests */
import { AuthenticationInterceptor } from './modules/authentication/authentication-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// How I want Authentication to be included
// import { AuthenticationModule, AuthenticationInterceptor, AuthenticationRoutes } from '@agape/authentication';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';


/**
 * Home Module
 */
import { HomeModule } from './modules/home/home.module';

const appRoutes: Routes = [];


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,

    AuthenticationModule,
    HomeModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
