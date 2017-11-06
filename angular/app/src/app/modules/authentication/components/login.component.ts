import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';


import { slideIn, slideOut, shrinkOut } from '../../../animations';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: './login.component.html',
   providers: [AuthenticationService],
   animations: [slideIn, slideOut, shrinkOut]
})
export class LoginComponent implements OnInit {

	private model: any = {};
    private form: any;
    private formState: string = 'pending';
    private loading: boolean = false;
    private showPassword: boolean;

	constructor(
		private service: AuthenticationService,
		private snackBar: MatSnackBar ) { }

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl('', [ ]),
			password: new FormControl('', [ ]),
		});
	}

	submit() {
		this.loading = true;
		this.service.login(this.model)
			.then( 
				(user:any) => {
					this.loading = false;
					console.log(user);
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
