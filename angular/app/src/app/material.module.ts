// import all material modules here


import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
	  MatButtonModule,
	  MatMenuModule,
	  MatToolbarModule,
	  MatIconModule,
	  MatCardModule
  ],
  exports: [
	  MatButtonModule,
	  MatMenuModule,
	  MatToolbarModule,
	  MatIconModule,
	  MatCardModule
  ]
})
export class MaterialModule { }

