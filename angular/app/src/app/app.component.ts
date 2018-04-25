import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import '../assets/css/styles.css';
import { User } from './modules/authentication/models/user';
import { AuthenticationService } from './modules/authentication/services/authentication.service';
import { MatSidenav } from "@angular/material"

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit { 

	private currentUser: User;
	private isMobileView: boolean;

	// provide access the sidenav element
	@ViewChild('sidenav') sidenav: MatSidenav;

	constructor(
		private auth: AuthenticationService ) { 
	}

	ngOnInit() {
		console.log('Initializing.............');
		this.updateViewSize();
	}



	/**
	 * Show or hide the navbar depending on the screen size.
	 * 
	 * Listens to window resize events and toggles the navbar as needed.
	 * Sets the variable this.isMobileView to true or false.
	 * 
	 */
  	@HostListener('window:resize', ['$event'])
    onResize() {
    	this.updateViewSize();
	}


	updateViewSize():void {
        if ( window.innerWidth < 980) {

            this.sidenav.close();
            this.isMobileView = true;
            console.log('Closing sidenav');
        }
        if ( window.innerWidth >= 980) {
           this.sidenav.open();
           this.isMobileView = false;
           console.log('Opening sidenav');
        }
	}


    /**
     * Close the navbar when links are clicked on small screen sizes.
     */
	onNavbarLinkClick():void {
		if (this.isMobileView) {
		  this.sidenav.close();
		}
	}
}


