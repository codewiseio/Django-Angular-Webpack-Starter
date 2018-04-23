import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';


import { User } from '../models/user';
import { slideIn } from '../../../animations';

import { ConfirmPasswordDialogComponent } from './confirm-password-dialog.component';


const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  templateUrl: './modify-credentials.component.html',
  animations: [slideIn]
})
export class ModifyCredentialsComponent implements OnInit {

    private model: any = {};
    private form: any;
    private loading: boolean = false;
    private formState: string = 'pending';

    private currentUser: User;

    constructor(
        private service: AuthenticationService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) { }

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl('', [ Validators.pattern(EMAIL_REGEX)]),
			password: new FormControl('', [ ]),
		});

		let session =  JSON.parse(localStorage.getItem('currentUser'));
		console.log('Retrieve session');
		console.log(session);
		if ( session ) {
			this.currentUser = session.user;
			this.model.email = this.currentUser.email;
		}
	}

	/**
	 * ModifyCredentials for a user
	 */
	submit() {

		// display a popup and confirm the current password
		const dlg = this.dialog.open(ConfirmPasswordDialogComponent, {
	      width:"350px"
	    });
	    dlg.afterClosed().toPromise().then(
	    		(password) =>  {
	    			this.loading = true;

	    			if ( password ) {
		    			let data = {...this.model};
		    			data.confirm_password = password;

						this.service.modifyCredentials(this.currentUser.id, data)
							.then( user => {
								this.formState = 'complete';
								this.loading = false;
								this.model.password = "";
								this.snackBar.open('Credentials saved', null, {
							      duration: 2000,
							    });
							},
							(response: any) => {
								this.loading = false;
								if ( response.status == 401 ) {
									let message = "Incorrect password";

									this.snackBar.open(message, null, {
								      duration: 2000,
								    });
								}
							}
						);
	    			}

	    		}
	    	);



	}


	confirmPassword() {

	}

} // end class ModifyCredentialsComponent


