import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import {  debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IShare } from '../../_models/share.model';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors, ICSCS, ValidationMessages } from './cscs-verify.validators';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  cscsName: string;

  constructor(
    private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    private router: Router,
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
      });

    this.myForm.get('cscsNo').valueChanges.pipe(
      filter(res => res.length > 2)
      , debounceTime(800), distinctUntilChanged()
      , switchMap(data => {
        this.cscsName = ''; this.submitting = true;
        return this.apiService.post(`/api/v1/mtn/customers/first-step`, {"cscsNo": data});
      })
    ).subscribe((response: any) => {
      this.submitting = false;
      this.cscsName = response.data.cscsResponse;
    },
    errResp => {
      Swal.fire('Oops...', errResp?.error?.error?.message? errResp?.error?.error?.message : errResp.statusText, 'error')
    });
  }

  populateExpression(expression: ICSCS) {
    console.log(expression);
    this.myForm.patchValue({
      cscsNo: expression?.cscsNo,
    });
  }

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
      this.submitting = false;
      return;
    }
    console.log(this.myForm.value);
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    fd.cscsNo = fd.cscsNo.toString()
    this.apiService.patch('/api/v1/verifications/cscs/no-verification', fd)
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
          return this.apiService.get(`/api/v1/customers/profile/fetch`)
        })
      )
      .subscribe((user) => {
        this.submitting = false;
        this.appService.userInformation = user.data

        this.router.navigateByUrl(`/dashboard/transactions/${this.txn.id}/${this.txn.asset.id}/make-payment`);
      },
      errResp => {
        this.submitting = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }

}
