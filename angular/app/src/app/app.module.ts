import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule }    from '@angular/common/http';

import { MaterialModule } from './material.module';


import { AuthenticationModule } from './modules/authentication/authentication.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from './modules/authentication/authentication-interceptor';


import { AppComponent } from './app.component';



const appRoutes: Routes = [
];


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,

    AuthenticationModule,
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
