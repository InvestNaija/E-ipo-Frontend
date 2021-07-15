import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@app/_shared/services/api.service';
import { AuthService } from '@app/_shared/services/auth.service';
import { ApplicationContextService } from "@app/_shared/services/application-context.service";
import Swal from 'sweetalert2';

import { FormErrors, ValidationMessages } from './signup.validators';
import { CommonService } from '@app/_shared/services/common.service';

@Component({
  selector: 'in-inl-signup',
  templateUrl: './inl-signup.component.html',
  styleUrls: ['./inl-signup.component.scss']
})
export class InlSignupComponent implements OnInit {
  myForm: FormGroup;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  APIResponse = false; submitting = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private authService: AuthService,
    private commonServices: CommonService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.myForm = this.fb.group({
      bvn: ['', Validators.required],
      dob: ['', Validators.required],
      // firstName: [null, Validators.required],
      // lastName: [null, Validators.required],
    });
  }


  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(this.myForm.get(ctrlName) as FormControl);
    this.displayErrors();
  }
  onSubmit() {
    // console.log(this.myForm.value);
    this.APIResponse = true; this.submitting = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      this.displayErrors();
      this.APIResponse = false; this.submitting = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    this.api.post('/api/v1/verifications/bvn', fd, false)
      .subscribe(response => {
        this.APIResponse = false; this.submitting = false;
        this.authService.signup$.next(response.data);
        this.router.navigate(['/auth/signup-continue']);
      },
      errResp => {
        this.APIResponse = false; this.submitting = false;
        if(errResp?.status === 503) {
          Swal.fire('Oops...', 'Service is currently unavailable. Please try again later', 'error');
        } else {
          Swal.fire('Oops...', errResp?.error?.error?.message, 'error');
        }
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
