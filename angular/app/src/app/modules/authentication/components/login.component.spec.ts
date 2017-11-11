import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { LoginComponent } from './login.component';

import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';


let AuthenticationServiceStub = {
  isLoggedIn: true,
  user: { name: 'Test User'}
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers:    [ {provide: AuthenticationService, useValue: AuthenticationServiceStub } ],
      imports: [
        FormsModule, 
        BrowserAnimationsModule,
        ReactiveFormsModule, 

        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatSnackBarModule
      ],
 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
