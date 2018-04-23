import { Component } from '@angular/core';
import '../assets/css/styles.css';
import { User } from './modules/authentication/models/user';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent { 

	private currentUser: User;
	 

	constructor() { 
		let session =  JSON.parse(localStorage.getItem('currentUser'));
		if ( session ) {
			this.currentUser = session.user;
		}
	}

}


