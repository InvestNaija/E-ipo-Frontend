import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { ApiService } from '@app/_shared/services/api.service';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { AuthService } from '@app/_shared/services/auth.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './forgot-password.validators';

@Component({
  selector: 'in-inl-forgot-password',
  templateUrl: './inl-forgot-password.component.html',
  styleUrls: ['./inl-forgot-password.component.scss']
})
export class InlForgotPasswordComponent implements OnInit {
  myForm: FormGroup;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  APIResponse = false; submitting = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private appContext: ApplicationContextService,
    private commonServices: CommonService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.myForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.APIResponse = true; this.submitting = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      Object.keys(this.errors).forEach((control) => {
        Object.keys(this.errors[control]).forEach(error => {
          this.uiErrors[control] = ValidationMessages[control][error];
        })
      });
      this.APIResponse = false; this.submitting = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    const getUrl = window.location;
    fd.baseUrl = getUrl .protocol + "//" + getUrl.host
    // console.log(fd); return;

    this.api.post('/api/v1/auth/customers/forgot-password', fd, false)
      .subscribe(response => {
        this.APIResponse = false; this.submitting = false;
        Swal.fire('', response?.message, 'success');
        // if (this.auth.redirectUrl) {
          this.router.navigateByUrl('/');
        //   this.auth.redirectUrl = '';
        // } else {
        //   this.router.navigate(['/dashboard']);
        // }
      },
      response => {
        console.log(response.error);
        this.APIResponse = false; this.submitting = false;
        Swal.fire('Oops...', response?.error?.error?.message, 'error')
      });
  }

}
