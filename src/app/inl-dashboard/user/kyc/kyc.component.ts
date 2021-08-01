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
      .subscribe(response => {
        this.submitting = false;
        Swal.fire('Great!', response?.message, 'success');
      },
      errResp => {
        this.submitting = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }
}
