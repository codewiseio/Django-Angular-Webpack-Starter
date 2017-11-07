import { Directive } from '@angular/core';
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

  validate( formControl: FormControl ): ValidationErrors {
    const message = {
      'unique': {
        'message': 'This email address is already registered.'
      }
    };

    // check if email is unique
    return this.AuthenticationService.checkEmailIsRegistered(formControl.value).toPromise().then(
        (response) => {
          if ( response.length < 1 ) { 
            console.log(response);
            return null;
          }
          else {
            return message;
          }
        }
      );
  }
}