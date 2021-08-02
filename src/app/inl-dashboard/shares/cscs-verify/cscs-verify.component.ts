import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import {  switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IShare } from '../../_models/share.model';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors, ICSCS, ValidationMessages } from './cscs-verify.validators';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '@environments/environment';

@Component({
  selector: 'in-cscs-verify',
  templateUrl: './cscs-verify.component.html',
  styleUrls: ['./cscs-verify.component.scss']
})
export class VerifyCscsComponent implements OnInit {

  myForm: FormGroup;
  share: IShare;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;

  submitting = false;

  total = 0;
  assetId: string;
  txn: any;

  constructor(
    private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    private apiService: ApiService,
    public commonServices: CommonService,
    private appService: ApplicationContextService,
    @Inject(DOCUMENT) private document: Document
    ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      cscsNo: ['', [Validators.required]],
    });

    this.aRoute.paramMap
      .pipe(
        switchMap(params => {
          this.assetId = params.get('id');
          return this.apiService.get(`/api/v1/reservations/fetch/${params.get('id')}`)
        })
      )
      .subscribe(response => {
        this.txn = response.data
      })
  }

  populateExpression(expression: ICSCS) {
    console.log(expression);
    this.myForm.patchValue({
      cscsNo: expression?.cscsNo,
    });
  }

  // verifyNo(cscsNo: number) {
  //   /api/v1/verifications/cscs
  // }

  onSubmit() {
    this.submitting = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      console.log(this.errors);
      Object.keys(this.errors).forEach((control) => {
        Object.keys(this.errors[control]).forEach(error => {
          this.uiErrors[control] = ValidationMessages[control][error];
        })
      });
      this.submitting = true;
      return;
    }
    console.log(this.myForm.value);
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    fd.cscsNo = fd.cscsNo.toString()
    this.apiService.post('/api/v1/verifications/cscs', fd)
      .pipe(
        switchMap(resp => {
          Swal.fire({
            title: resp.message,
            icon: 'success',
            text: 'Redirecting...Please wait',
            confirmButtonText: `Ok`,
            allowOutsideClick: false,
            allowEscapeKey: false
          })
          console.log(resp);
          const payload = {
            gateway: environment.gateway,
            reservationId: this.assetId,
            currency: this.txn.asset?.currency
          }

        return combineLatest([
            this.apiService.get(`/api/v1/customers/profile/fetch`),
            this.apiService.post('/api/v1/reservations/make-payment', payload)
          ])
        })
      )
      .subscribe(([user, paymentRef]) => {
        this.submitting = false;
        this.appService.userInformation = user.data
        this.document.location.href = paymentRef.data.authorization_url;
      },
      errResp => {
        this.submitting = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }

}
