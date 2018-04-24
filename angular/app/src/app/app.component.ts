import { Component } from '@angular/core';
import '../assets/css/styles.css';
import { User } from './modules/authentication/models/user';
import { AuthenticationService } from './modules/authentication/services/authentication.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent { 

	private currentUser: User;
	 

	constructor(
		private auth: AuthenticationService ) { 

	}

}


