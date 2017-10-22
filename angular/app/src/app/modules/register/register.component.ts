import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import {NgForm} from '@angular/forms';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {

    model: any = {};
    loading = false;

    constructor(
        private RegisterService: RegisterService) { }

	ngOnInit() {}

	/**
	 * Register a user
	 */
	register() {
		console.log('Registering');
		this.RegisterService.register(this.model)
			.then( user => {
				console.log('Created user ');
				console.log(user);
			});
		}

} // end class RegisterComponent


