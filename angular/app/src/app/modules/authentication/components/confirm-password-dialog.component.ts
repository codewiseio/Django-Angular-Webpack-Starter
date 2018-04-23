import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  templateUrl: './confirm-password-dialog.component.html'
})
export class ConfirmPasswordDialogComponent implements OnInit {

	private model: any = {};
    private form: any;
    private showPassword: boolean; // display password unobscured

	constructor() { }

	ngOnInit() {
		this.form = new FormGroup({
			password: new FormControl('', [ ]),
		});
	}

	submit() {


	}

}
