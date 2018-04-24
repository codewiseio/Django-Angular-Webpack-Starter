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

    constructor(
        private service: AuthenticationService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) { }

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl('', [ Validators.pattern(EMAIL_REGEX)]),
			password: new FormControl('', [ ]),
		});

		this.model.email = this.service.user.email;
	}

	/**
	 * ModifyCredentials for a user
	 */
	submit() {

		// display a popup and confirm the current password
		const dlg = this.dialog.open(ConfirmPasswordDialogComponent, {
	      width:"350px"
	    });

	    // after the dialog is closed, perform api call
	    dlg.afterClosed().toPromise().then(
	    		(password) =>  {
	    			this.loading = true;

	    			// password supplied, continue with api call
	    			if ( password ) {
		    			let data = {...this.model};
		    			data.confirm_password = password;

						this.service.modifyCredentials(this.service.user.id, data)
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


