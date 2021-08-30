import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IShare } from '../../_models/share.model';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrors, ICSCS, ValidationMessages } from './cscs-create.validators';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '@environments/environment';

@Component({
  selector: 'in-cscs-create',
  templateUrl: './cscs-create.component.html',
  styleUrls: ['./cscs-create.component.scss']
})
export class CscsCreateComponent implements OnInit {

  myForm: FormGroup;
  share: IShare;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;

  isGetFormDetail: boolean; submitting = false;

  total = 0;
  txnId: string;

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
      fullName: [{value: '', disabled: true}, [Validators.required]],
      MaidenName: ['', [Validators.required]],
      City: [null, [Validators.required]],
      Country: [null, [Validators.required]],
      Citizen: [null, [Validators.required]],
      PostalCode: [null, [Validators.required]],
    });

    this.aRoute.paramMap
      .pipe(
        switchMap(params => {
          this.txnId = params.get('id');
          this.isGetFormDetail = true;
          return this.apiService.get('/api/v1/customers/profile/fetch');

        })
      ).subscribe(userInfo => {
        this.isGetFormDetail =  false;
        const user = userInfo.data;
        this.appService.userInformation = user;
        this.myForm.patchValue({
          fullName: user.firstName + ' ' + user.lastName,
          MaidenName: user.mothersMaidenName
        })
        if(!user.bankCode) {
          Swal.fire({
            title: 'Update Bank Details',
            text: "Your bank information is needed to proceed",
            confirmButtonText: `Update`,
            allowOutsideClick: false
          }).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem('creating-cscs', this.txnId)
                this.router.navigateByUrl('/dashboard/user/banks')
              }
          })
        }
      })
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
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    this.apiService.post('/api/v1/customers/create-cscs', fd)
      .pipe(
        switchMap(resp => {
          console.log(resp);
          const payload = {
            gateway: environment.gateway,
            reservationId: this.txnId
          }
          return this.apiService.post('/api/v1/reservations/make-payment', payload)
        })
      )
      .subscribe(response => {
        this.document.location.href = response.data.authorization_url;
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
