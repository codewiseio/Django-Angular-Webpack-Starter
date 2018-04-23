import { Directive, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Directive({
  selector: '[uniqueEmail]',
  providers: [
    AuthenticationService,
    {provide:NG_ASYNC_VALIDATORS, 
     useExisting: UniqueEmailValidatorDirective, 
     multi: true}
    ]
})

export class UniqueEmailValidatorDirective implements Validator {

  constructor(
    private AuthenticationService: AuthenticationService) { }

  // get the value applied to the uniqueEmail attribute 
  // this is going to be the user id to exclude from the unique email check
  @Input('uniqueEmail') userId: string;

  validate( formControl: FormControl ): ValidationErrors {
    const message = {
      'unique': {
        'message': 'This email address is already registered.'
      }
    };

    // check if email is unique
    return this.AuthenticationService.validateEmail(formControl.value, this.userId).toPromise().then(
        (response) => {
          if ( response.valid ) { 
            return null;
          }
          else {
            return message;
          }
        }
      );
  }
}