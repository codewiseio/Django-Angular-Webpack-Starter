import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

	model: any = {};

    private form: any;
    private showPassword: boolean;

	constructor() { }

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl('', [ ]),
			password: new FormControl('', [ ]),
		});
	}

}
