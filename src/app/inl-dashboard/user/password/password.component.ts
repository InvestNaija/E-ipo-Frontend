import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './password.validators';

@Component({
  selector: 'in-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  myForm: FormGroup;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      oldPassword: [null, [
        Validators.required,
        Validators.minLength(6), Validators.maxLength(15),
        this.commonServices.regexValidator(new RegExp(this.commonServices.oneDigit), {'oneDigit': ''}),
        this.commonServices.regexValidator(new RegExp(this.commonServices.oneLowerCase), {'oneLowerCase': ''}),
        this.commonServices.regexValidator(new RegExp(this.commonServices.oneUpperCase), {'oneUpperCase': ''}),
        this.commonServices.regexValidator(new RegExp(this.commonServices.specialChar), {'specialChar': ''}),
      ]],
      newPassword: [null, [
        Validators.required,
        Validators.minLength(6), Validators.maxLength(15),
        this.commonServices.regexValidator(new RegExp(this.commonServices.oneDigit), {'oneDigit': ''}),
        this.commonServices.regexValidator(new RegExp(this.commonServices.oneLowerCase), {'oneLowerCase': ''}),
        this.commonServices.regexValidator(new RegExp(this.commonServices.oneUpperCase), {'oneUpperCase': ''}),
        this.commonServices.regexValidator(new RegExp(this.commonServices.specialChar), {'specialChar': ''}),
      ]],
      confirmNewPassword: [null, [Validators.required, Validators.minLength(6)]],
    },{validators: this.commonServices.mustMatch('newPassword', 'confirmNewPassword')});
  }

  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(this.myForm.get(ctrlName) as FormControl);
    this.displayErrors();
  }

  onSubmit() {
    this.submitting = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      this.displayErrors();
      this.submitting = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    this.apiService.post('/api/v1/auth/customers/change-password', fd)
      .subscribe(response => {
        this.submitting = false;
        Swal.fire('Great!', response?.message, 'success')
      },
      errResp => {
        this.submitting = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }
  displayErrors() {
    Object.keys(this.formErrors).forEach((control) => {
      this.formErrors[control] = '';
    });
    Object.keys(this.errors).forEach((control) => {
      Object.keys(this.errors[control]).forEach(error => {
        this.uiErrors[control] = ValidationMessages[control][error];
      })
    });
  }
}
