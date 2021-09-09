import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IShare } from '../../_models/share.model';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrors, IExpression, ValidationMessages } from './expression.validators';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'in-expression',
  templateUrl: './expression.component.html',
  styleUrls: ['./expression.component.scss']
})
export class ExpressionComponent implements OnInit {

  myForm: FormGroup;
  share: IShare;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  termsRead: boolean;
  submitting = false;

  total = 0;
  assetId: string;
  currentMarketValue: any;

  constructor(
    private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public commonServices: CommonService,
    private appService: ApplicationContextService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      type: [{ value: '', disabled: true }, [Validators.required]],
      sharePrice: [{ value: '', disabled: true }, [Validators.required]],
      units: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required]],
    });

    this.aRoute.paramMap.pipe(
      switchMap(params => {
        this.commonServices.loading().next(true);
        this.assetId = params.get('id');
        return this.apiService.get(`/api/v1/assets/${this.assetId}`);
      })
    ).subscribe(response => {
      this.commonServices.loading().next(false);
      this.share = response.data;

      const today = new Date();
      const closingDate = new Date(this.share.closingDate);
      if(today > closingDate) this.share.openForPurchase = false;
      else this.share.openForPurchase = true;

      this.populateExpression(response.data)
    })
    this.getCurrentMarketValue();
    //
  }

  getCurrentMarketValue() {
    this.apiService.getZanibal('https://mds.zanibal.com/mds/rest/api/v1/research/get-security-overview/symbol?x=NSE&s=MTNN')
      .subscribe(
        response => {
          this.currentMarketValue = response.lastPrice;
        },
        errResp => {
        });
  }

  populateExpression(expression: IExpression) {
    // console.log(expression);
    this.myForm.patchValue({
      type: expression?.type == 'ipo' ? 'PUBLIC OFFER' : expression?.type,
      sharePrice: expression?.sharePrice ? expression?.sharePrice : null,
      units: expression?.units ? expression?.units : 0,
      amount: expression?.amount
    });
    this.myForm.get('amount').setValidators([Validators.required, Validators.min(this.share.anticipatedMinPrice)]);
    this.myForm.get('amount').updateValueAndValidity();
    if (!expression?.sharePrice) {
      this.myForm.controls['units'].disable();
    }

  }
  amountChanged(ctrlName: string) {
    this.myForm.patchValue({
      units: this.myForm.get('sharePrice').value ? +this.myForm.get(ctrlName).value / +this.myForm.get('sharePrice').value : 0
    })
    this.errors = this.commonServices.controlnvalid(this.myForm.get(ctrlName) as FormControl);
    this.displayErrors();
  }
  unitsChanged(ctrlName: string) {
    this.myForm.patchValue({
      amount: +this.myForm.get('sharePrice').value * +this.myForm.get(ctrlName).value
    })
    this.errors = this.commonServices.controlnvalid(this.myForm.get(ctrlName) as FormControl);
    this.displayErrors();
  }

  onPayLater(isPayingNow: boolean) {
    this.onSubmit(isPayingNow);
  }
  onTermsReadChange(event){
    this.termsRead = event;
  }
  onSubmit(isPayingNow: boolean) {
    this.submitting = true;

    if(!this.termsRead) {
      this.submitting = false;
      this.toastr.error('Terms and Condition needs to be accepted', 'Error');
      return;
    }
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      this.displayErrors();
      this.submitting = false;
      return;
    }
    const fd = {
      units: this.myForm.get('units').value ? this.myForm.get('units').value : 0,
      amount: this.myForm.get('amount').value,
      assetId: this.assetId
    };
    // console.log(fd); return

    // this.APIResponse = false; this.submitting = false;
    this.apiService.post(`/api/v1/reservations/express-interest`, fd)
      .subscribe(response => {
        if (isPayingNow) {
          this.submitting = false;
          let element = { id: response.data.reservation.id, asset: { id: response.data.asset.id }, goToTxns: true };
          this.appService.checkCSCS(element);
          this.router.navigateByUrl(`/dashboard/transactions`);
        } else {
          this.router.navigateByUrl(`/dashboard/transactions`);
        }
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
