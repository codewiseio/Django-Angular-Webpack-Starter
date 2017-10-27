
import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
@Directive({
    selector: '[confirmPassword][formControlName],[confirmPassword][formControl],[confirmPassword][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => ConfirmPasswordValidatorDirective), multi: true }
    ]
})
export class ConfirmPasswordValidatorDirective implements Validator {
    constructor( @Attribute('confirmPassword') public confirmPassword: string,
                 @Attribute('confirmation') public confirmation: string) {
    }

    private get isConfirmation(): boolean {
        return this.confirmation === "true" ? true: false;
    }

    validate(formControl: AbstractControl): { [key: string]: any } {

        let value = formControl.value;
        let confirmControl = formControl.root.get(this.confirmPassword);

        const message = {
          'confirmPassword': {
            'message': 'Passwords do not match.',
          }
        };

        // value not equal is confirmation field
        if ( confirmControl && value !== confirmControl.value && this.isConfirmation ) {
            return message;
        }

        // value equal and not confirmation field
        if ( confirmControl && value === confirmControl.value && ! this.isConfirmation ) {
            delete confirmControl.errors['confirmPassword'];
            if (!Object.keys(confirmControl.errors).length) confirmControl.setErrors(null);
        }

        // value not equal and not confirmation
        if (confirmControl && value !== confirmControl.value && ! this.isConfirmation ) {
            confirmControl.setErrors(message);
        }

        return null;

    }
}