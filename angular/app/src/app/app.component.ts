import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

import '../assets/css/styles.css';

@Component({
  selector: 'oikus-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthenticationService, UserService]
})
export class AppComponent { 

	constructor(
		private AuthenticationService: AuthenticationService) { 
		this.AuthenticationService.getToken();
	}

}


