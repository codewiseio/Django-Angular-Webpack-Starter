import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


@Component({
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

    private model: any = {};
    private form: any;
    private showPassword: boolean;

    constructor() { }

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl('', [ Validators.pattern(EMAIL_REGEX)]),
			password: new FormControl('', [ ]),
		});
	}

	/**
	 * Register a user
	 */
	submit() {
		console.log('Registering...');
		
	}
}
