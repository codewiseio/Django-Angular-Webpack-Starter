import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

import { slideIn, slideOut, shrinkOut } from '../../../animations';


const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  templateUrl: './register.component.html',
  animations: [slideIn, slideOut, shrinkOut]
})
export class RegisterComponent implements OnInit {

    private model: any = {};
    private form: any;
    private showPassword: boolean;
    private loading: boolean = false;
    private formState: string = 'pending';

    constructor(
        private service: AuthenticationService) { }

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
		this.loading = true;
		this.service.register(this.model)
			.then( user => {
				this.formState = 'complete';
				console.log('Created user ');
				console.log(user);
			});
	}

} // end class RegisterComponent


