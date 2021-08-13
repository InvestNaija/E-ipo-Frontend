import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './kyc.validators';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

@Component({
  selector: 'in-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KYCComponent implements OnInit {
  myForm: FormGroup;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  submitting = false; disableButton=false
  container = {};

  loadingBankName: boolean;
  bankAccountName: {success: boolean, name: string}

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public apiService: ApiService,
    private appContext: ApplicationContextService,
    public commonServices: CommonService
    ) { }

  ngOnInit(): void {
    this.commonServices.isLoading$.pipe(
      switchMap(loading => {
        return this.appContext.userInformationObs();
      })
    ).subscribe(user => {
      this.myForm = this.fb.group({
        motherMaidenName: [user.mothersMaidenName, [Validators.required]],
        placeOfBirth: [user.placeOfBirth, [Validators.required]],
      });
    });
  }

  onSubmit() {
    this.submitting = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      Object.keys(this.errors).forEach((control) => {
        Object.keys(this.errors[control]).forEach(error => {
          this.uiErrors[control] = ValidationMessages[control][error];
        })
      })
      this.submitting = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    this.apiService.patch('/api/v1/customers/update-profile', fd)
      .pipe(
        switchMap(resp => {
          return this.apiService.get(`/api/v1/customers/profile/fetch`)
        })
      )
      .subscribe(user => {
        this.submitting = false;
        this.appContext.userInformation = user.data
        const cscsPage = localStorage.getItem('creating-cscs');
        const makingPayment = localStorage.getItem('making-payment');
        if(!!cscsPage) {
          Swal.fire({
            icon: 'success',
            title: 'Update successful!',
            text: 'You will be redirected back to update CSCS data',
            confirmButtonText: `Proceed`,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
              if (result.isConfirmed) {
                localStorage.removeItem('creating-cscs');
                this.router.navigateByUrl(`dashboard/shares/${cscsPage}/create-new-cscs`)
              }
          })
        } else if(!!makingPayment) {
          Swal.fire({
            icon: 'success',
            title: 'Update successful!',
            text: 'You will be redirected back to payment page',
            confirmButtonText: `Proceed`,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
              if (result.isConfirmed) {
                localStorage.removeItem('making-payment');
                const txn = JSON.parse(makingPayment)
                this.router.navigateByUrl(`/dashboard/transactions/${txn.id}/${txn.asset.id}/make-payment`)
              }
          })
        }else {
          Swal.fire('Great!', 'Update successful!', 'success')
        }
      },
      errResp => {
        this.submitting = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }
}
