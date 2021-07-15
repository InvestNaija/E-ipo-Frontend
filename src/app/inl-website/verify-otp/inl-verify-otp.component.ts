import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '@app/_shared/services/auth.service';
import { ValidationMessages, FormErrors, KYCDetail } from './signup.validators';
import { CommonService } from '@app/_shared/services/common.service';
import { ApiService } from '@app/_shared/services/api.service';

@Component({
  selector: 'in-inl-verify-otp',
  templateUrl: './inl-verify-otp.component.html',
  styleUrls: ['./inl-verify-otp.component.scss']
})
export class InlVerifyOtpComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  signupSub: Subscription;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  container: any = {};
  resending = false;
  APIResponse = false; submitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private commonServices: CommonService,
    private router: Router) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.commonServices.email)]],
      otp: [null, [Validators.required, Validators.minLength(6)]],
    });
    this.signupSub = this.authService.signUp().subscribe(
      data => {
        console.log(data)
        if(data) {
          // this.populateKYCDetail(data);
        }
      }
    )
  }

  populateKYCDetail(kycDetail: KYCDetail) {
    this.myForm.patchValue({
      email: kycDetail?.email,
      otp: kycDetail?.otp,
    });
  }

  onResendOTP() {
    this.resending = true;
    const email = this.myForm.get('email');
    if(!email.value) {
      this.resending = false;
      Swal.fire('', 'Email Address is required', 'error');
      return;
    }
    const fd = {email: email.value}
    this.apiService.post('/api/v1/auth/customers/resend-otp', fd, false)
      .subscribe(response => {
        this.resending = false;
        Swal.fire('', response?.message, 'success');
      },
      errResp => {
        this.resending = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }

  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(this.myForm.get(ctrlName) as FormControl);
    this.displayErrors();
  }

  onSubmit() {
    this.APIResponse = false; this.submitting = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      this.displayErrors();
      this.APIResponse = false; this.submitting = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    console.log(fd);
    this.apiService.post('/api/v1/auth/customers/verify-otp', fd, false)
      .subscribe(response => {
        this.APIResponse = false; this.submitting = false;
        this.authService.signup$.next(response.data);
        this.router.navigate(['/auth/login']);
        Swal.fire('', response?.message, 'success');
        setTimeout(()=>{
        }, 2000)
      },
      errResp => {
        this.APIResponse = false; this.submitting = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }

  displayErrors() {
    Object.keys(this.errors).forEach((control) => {
      Object.keys(this.errors[control]).forEach(error => {
        this.uiErrors[control] = ValidationMessages[control][error];
      })
    });
  }

  ngOnDestroy() {
    if(this.signupSub) {
      this.signupSub.unsubscribe();
    }
  }

}

