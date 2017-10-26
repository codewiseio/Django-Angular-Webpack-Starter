import { Directive } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[uniqueEmail]',
  providers: [{provide:NG_ASYNC_VALIDATORS, useExisting: UniqueEmailValidatorDirective, multi: true}]
})
export class UniqueEmailValidatorDirective implements Validator {

  constructor(
    private UserService: UserService) { }

  validate( formControl: FormControl ): ValidationErrors {
    const message = {
      'unique': {
        'message': 'This email address is already registered.'
      }
    };

    // check if email is unique
    return this.UserService.checkEmailIsRegistered(formControl.value).toPromise().then(
        (response) => {
          console.log('Received promise.');
          console.log(response);
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