import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services';
import { confirmPassword } from 'src/app/helpers';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styles: []
})

export class EditProfileComponent implements OnInit {

    // Define variables
    submitted: boolean = false;
    error: any = '';
    success: any = false;

    // Define form 
    editProfileForm: FormGroup;

    constructor(private fb: FormBuilder, private auth: AuthService) { }

    // convenience getter for easy access to form fields
    get f() {
        return this.editProfileForm.controls;
    }

    /**
     * Form submit callback
     */
    onSubmit() {
        this.success = false;
        this.error = false;
        this.submitted = true;

        // stop here if form is invalid
        if (this.editProfileForm.invalid) {
            return;
        }

        var formData = {
            firstname: this.f.firstname.value,
            lastname: this.f.lastname.value,
            email: this.f.email.value,
            password: this.f.password.value,
            confirmpassword: this.f.confirmpassword.value,
        };

        this.auth.update(formData)
            .subscribe(
                () => {
                    this.success = true;
                    this.f.password.setValue('');
                    this.f.confirmpassword.setValue('');
                }, err => {
                    this.error = err;
                }
            );
    }

    ngOnInit() {
        this.editProfileForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.minLength(6)],
            confirmpassword: [''],
        }, {
            validator: confirmPassword('password', 'confirmpassword')
        }
        );

        this.f.password.valueChanges
            .subscribe(
                change => {
                    if (change == '') {
                        this.f.confirmpassword.setErrors(null);
                    }
                }
            );

        this.setValues();
    }

    setValues() {
        this.auth.AuthUser().subscribe(
            res => {
                this.auth.currentUser = res.data;
                this.f.firstname.setValue(this.auth.currentUser.firstname);
                this.f.lastname.setValue(this.auth.currentUser.lastname);
                this.f.email.setValue(this.auth.currentUser.email);
            }
        );
    }
}
