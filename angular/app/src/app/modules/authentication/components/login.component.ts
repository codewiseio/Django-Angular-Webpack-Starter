import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { User } from '../models/user';
import { slideIn, slideOut, shrinkOut } from '../../../animations';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: './login.component.html',
  animations: [slideIn, slideOut, shrinkOut]
})
export class LoginComponent implements OnInit {

	private model: any = {};
    private form: any;
    // if form has been submitted and awaiting response
    private loading: boolean = false;
    private formState: string = 'pending';

    // display password unobscured
    private showPassword: boolean;


	constructor(
		private service: AuthenticationService,
		private snackBar: MatSnackBar ) { 

	}

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl('', [ ]),
			password: new FormControl('', [ ]),
		});
	}

	submit() {
		this.loading = true;
		this.service.login(this.model.email, this.model.password)
			.then( 
				(user:any) => {
					this.loading = false;

					let message = "Login Successful";
					this.formState = 'complete';

					this.snackBar.open(message, null, {
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
