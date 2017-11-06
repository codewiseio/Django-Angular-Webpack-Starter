import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

import { slideIn, slideOut, shrinkOut } from '../../../animations';


const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


@Component({
  	templateUrl: './reset-password-request.component.html',
  	animations: [slideIn, slideOut, shrinkOut]
})
export class ResetPasswordRequestComponent implements OnInit {

    private model: any = {};
    private form: FormGroup;
    private formState: string = 'pending';
    private loading: boolean = false;


    constructor(
        private AuthenticationService: AuthenticationService) { }

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl('', [ Validators.pattern(EMAIL_REGEX)])
		});
	}

	/**
	 * Submit the form
	 */
	submit() {
		this.loading = true;
		this.AuthenticationService.resetPasswordRequest(this.model.email)
			.toPromise()
			.then( 	() => {
						this.formState = 'success';
					},

					() => {
						// display an error message
					}
					);
		}
}
