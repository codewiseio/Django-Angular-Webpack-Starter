import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {NgForm} from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {

    model: any = {};
    loading = false;

    private form: FormGroup;

    constructor(
        private RegisterService: RegisterService) { }

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl('', [ Validators.required, Validators.pattern(EMAIL_REGEX)]) 
		});
	}

	/**
	 * Register a user
	 */
	register() {
		console.log('Registering...');
		this.RegisterService.register(this.model)
			.then( user => {
				console.log('Created user ');
				console.log(user);
			});
		}

} // end class RegisterComponent


