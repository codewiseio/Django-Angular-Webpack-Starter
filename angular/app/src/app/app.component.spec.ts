import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule
} from '@angular/material';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
    	{ 
    		declarations: [AppComponent],
    		providers: [{provide: APP_BASE_HREF, useValue : '/' }],
    		imports: [ 
				MatButtonModule,
				MatMenuModule,
				MatToolbarModule,
				MatIconModule,
				RouterModule.forRoot(
					[],
					{ enableTracing: true } // <-- debugging purposes only
				)
    		],
    	}
    	);
  });

  it ('should work', () => {
    let fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'Should create AppComponent');
  });
});
