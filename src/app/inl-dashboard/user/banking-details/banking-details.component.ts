import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './banking-details.validators';
import { catchError, concatMap, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

@Component({
  selector: 'in-banking-details',
  templateUrl: './banking-details.component.html',
  styleUrls: ['./banking-details.component.scss']
})
export class BankingDetailsComponent implements OnInit, AfterViewInit {
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
        nuban: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(/[0-9]+$/), Validators.minLength(10)]],
        bankCode: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(6)]],
      });
      if(user.bankCode) {
        this.myForm.patchValue({
          bankCode: {code: user.bankCode, name: user.bankName},
          nuban: user.nuban
        })
      }
    });
  }

  ngAfterViewInit() {
    this.myForm.patchValue({
      nuban: []
    });
  }

  onNubanChanged() {
    let nuban = this.myForm.get('nuban').value;
    if(!this.myForm.get('bankCode').value){
      this.myForm.get('nuban').patchValue( null, {emitEvent: false} );
      Swal.fire('Oops...', 'Please select a bank first', 'error')
      return null;;
    }
    if(nuban.length === 10) {
      const chosenBank = this.myForm.get('bankCode').value;
      this.loadingBankName = true
      const fd = {
        bank_code: chosenBank?.code,
        nuban: nuban
      }
      this.apiService.post('/api/v1/verifications/bank-account', fd)
      .subscribe((resp: any) => {
          this.loadingBankName = false; this.disableButton = false
          this.bankAccountName = {success: true, name: resp?.data?.account_name};
      },
      errResp => {
        this.loadingBankName = false; this.disableButton = true
        console.log(errResp?.error?.error?.message)
        this.bankAccountName = {success: false, name: errResp?.error?.error?.message};
      });
    }
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
    fd.bankName = fd.bankCode.name;
    fd.bankCode = fd.bankCode.code;
    fd.bankAccountName = this.bankAccountName?.name;
    this.apiService.patch('/api/v1/customers/update-bank-details', fd)
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

  getLOVs(endpoint: string, selectScope: string, options: any){
    if (this.container[selectScope] == null) {
      this.container[options['loading']] = 'Loading, please wait...';
      return this.http.get(endpoint).pipe(
        map((response: any) => {
            return of(response.data);
          }
        )
      )
          .subscribe(
            (response) => {
              this.container[options['loading']] = null;
              this.container[selectScope] = response;
            },
            (err) => {
              this.container[options['loading']] = null;
              console.log(err);
            }
          );
    }
  }
}
