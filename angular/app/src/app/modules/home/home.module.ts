import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { HomeComponent } from './components/home/home.component';
import { HomeRoutingModule } from './home-routing.module';

import {
  MatButtonModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    HomeRoutingModule,
  ],
  declarations: [
     HomeComponent,
  ],
  providers: [ 

  ]
  
})
export class HomeModule {}