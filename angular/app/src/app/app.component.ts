import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

import '../assets/css/styles.css';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthenticationService]
})
export class AppComponent { 

	constructor(
		private AuthenticationService: AuthenticationService) { 
		this.AuthenticationService.getToken();
	}

}


