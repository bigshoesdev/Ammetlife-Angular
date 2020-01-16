import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if ( control.value != '' && control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmpassword: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}