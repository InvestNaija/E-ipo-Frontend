import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { ApiService } from '@app/_shared/services/api.service';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { AuthService } from '@app/_shared/services/auth.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './reset-password.validators';

@Component({
  selector: 'in-inl-reset-password',
  templateUrl: './inl-reset-password.component.html',
  styleUrls: ['./inl-reset-password.component.scss']
})
export class InlResetPasswordComponent implements OnInit {
  myForm: FormGroup;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  APIResponse = false; submitting = false;
  container = {};

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private commonServices: CommonService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private appContext: ApplicationContextService,
    ) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.aRoute.queryParams.subscribe(params => {
      this.container['token'] = params["token-details"];
      this.myForm = this.fb.group({
        password: [null, [
            Validators.required,
            Validators.minLength(6),
            this.commonServices.regexValidator(new RegExp(this.commonServices.oneDigit), {'oneDigit': ''}),
            this.commonServices.regexValidator(new RegExp(this.commonServices.oneLowerCase), {'oneLowerCase': ''}),
            this.commonServices.regexValidator(new RegExp(this.commonServices.oneUpperCase), {'oneUpperCase': ''}),
          ]
        ],
        confirmPassword: [null, Validators.required],
      },{validators: this.commonServices.mustMatch('password', 'confirmPassword')});
    })
  }

  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(this.myForm.get(ctrlName) as FormControl);
    this.displayErrors();
  }
  onSubmit() {
    this.APIResponse = true; this.submitting = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      this.displayErrors();
      this.APIResponse = false; this.submitting = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    console.log(fd);

    this.api.post('/api/v1/auth/customers/reset-password/' + this.container['token'], fd, false)
      .subscribe(response => {
        this.APIResponse = false; this.submitting = false;
        Swal.fire('', response?.message, 'success');
        this.router.navigateByUrl('/');
      },
      errResp => {
        this.APIResponse = false; this.submitting = false;
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
