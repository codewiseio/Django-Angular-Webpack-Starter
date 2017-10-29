import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';



const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  templateUrl: './register.component.html',
  providers: [UserService],
  animations: [
    trigger(
      'cardState',
      [
		transition(
			':enter', [
			  style({transform: 'translateX(-100%)', opacity: 0}),
			  animate('200ms', style({transform: 'translateX(0)', 'opacity': 1}))
			]
		),
		transition(
			':leave', [
				style({transform: 'translateX(0) scale(1)'}),
				animate('200ms', style({transform: 'translateX(0) scale(0)'}))
			]
		),		
      ]
    ) 
  ]
})
export class RegisterComponent implements OnInit {

    model: any = {};
    loading = false;

    private form: any;
    private showPassword: boolean;

    private formState: string = 'pending';

    constructor(
        private UserService: UserService) { }

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

		this.UserService.register(this.model)
			.then( user => {
				this.formState = 'transitioning';
				setTimeout( () => {this.formState = 'complete'}, 205);

				console.log('Created user ');
				console.log(user);
			});
	}

} // end class RegisterComponent


