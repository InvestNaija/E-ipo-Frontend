import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '@app/_shared/services/auth.service';
import { ValidationMessages, FormErrors, KYCDetail } from './signup.validators';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'in-inl-signup-continue',
  templateUrl: './inl-signup-continue.component.html',
  styleUrls: ['./inl-signup-continue.component.scss']
})
export class InlSignupContinueComponent implements OnInit, OnDestroy {
  gender = [{id: 'm', name: 'Male' }, {id: 'f', name: 'Female' }];
  myForm: FormGroup;
  signupSub: Subscription
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  container: any = {};
  APIResponse = false; submitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private commonServices: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [null, Validators.required],
      middleName: [null],
      gender: [null, Validators.required],
      phone: [null, Validators.required],
      birthdate: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(this.commonServices.email)]],
      photo: [null],
      address: [null],
      nin: [null],
      bvn: [null, Validators.required], mothersMaidenName: [null, [Validators.required]], placeOfBirth: [null, [Validators.required]],
      signature: [],
      password: [null, [
          Validators.required,
          Validators.minLength(6), Validators.maxLength(15),
          this.commonServices.regexValidator(new RegExp(this.commonServices.oneDigit), {'oneDigit': ''}),
          this.commonServices.regexValidator(new RegExp(this.commonServices.oneLowerCase), {'oneLowerCase': ''}),
          this.commonServices.regexValidator(new RegExp(this.commonServices.oneUpperCase), {'oneUpperCase': ''}),
          this.commonServices.regexValidator(new RegExp(this.commonServices.specialChar), {'specialChar': ''}),
        ]
      ],
      confirmPassword: [null, Validators.required],
      accept: [false],
      bypassDND: [false]
    },{validators: this.commonServices.mustMatch('password', 'confirmPassword')});
    this.signupSub = this.authService.signUp().subscribe(
      data => {
        if(data) {
          this.populateKYCDetail(data);
        }
      }
    )
  }

  populateKYCDetail(kycDetail: KYCDetail) {
    let dob = kycDetail?.birthdate.split("-");
    const gender = this.gender.find(g => g.name === kycDetail?.gender);
    this.myForm.patchValue({
      firstName: kycDetail?.firstname,
      lastName: kycDetail?.lastname,
      middleName: kycDetail?.middlename,
      gender: gender,
      phone: kycDetail?.phone,
      birthdate: dob[2] + '-' + dob[1] + '-' +dob[0], //Format understood by browser
      email: kycDetail?.email,
      photo: kycDetail?.photo,
      address: kycDetail?.residentialAddress,
      nin: kycDetail?.nin,
      bvn: kycDetail?.bvn,
      signature: kycDetail?.signature,
    });
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
    fd.dob = fd.birthdate;
    fd.nin = Math.floor(10000000000 + Math.random() * 90000000000).toString();
    fd.gender = fd.gender.name
    delete fd.photo;
    delete fd.signature;

    if(!fd.accept) {
      this.toastr.error('You need to accept the terms and conditions to proceed', 'Error');
      this.APIResponse = false; this.submitting = false;
      return;
    }
    Swal.fire({
      title: 'Notice!',
      html: `The email address: <b style="color:red;">${this.myForm.get('email').value}</b> will be used as your email `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      cancelButtonText: 'No, Let me Change'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.post('/api/v1/auth/customers/signup', fd, false)
        .subscribe(response => {
          this.APIResponse = false; this.submitting = false;
          this.authService.signup$.next(response.data);
          Swal.fire('', response?.message, 'success');
          setTimeout(()=>{
            this.router.navigate(['/auth/verify-otp']);
          }, 2000)
        },
        errResp => {
          this.APIResponse = false; this.submitting = false;
          this.toastr.error(errResp?.error?.error?.message, errResp?.status+': '+errResp.statusText);
        });
      } else {
        this.APIResponse = false; this.submitting = false;
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

  ngOnDestroy() {
    if(this.signupSub) {
      this.signupSub.unsubscribe();
    }
  }

}

