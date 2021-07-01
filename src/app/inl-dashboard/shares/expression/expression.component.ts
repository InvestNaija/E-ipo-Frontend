import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IShare } from '../../_models/share.model';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors, IExpression, ValidationMessages } from './expression.validators';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

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

  submitting = false;

  total = 0;
  assetId: string;

  constructor(
    private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public commonServices: CommonService,
    private appService: ApplicationContextService
    ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      type: [{value: '', disabled: true}, [Validators.required]],
      sharePrice: [{value: '', disabled: true}, [Validators.required]],
      units: ['', [Validators.required]],
      amount: [{value: '', disabled: true}, [Validators.required]],
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
      this.populateExpression(response.data)
    })

    this.myForm.get('units').valueChanges
        .subscribe(val => {
          this.myForm.patchValue({
            amount: +this.myForm.get('sharePrice').value * val
          })
        });
  }

  populateExpression(expression: IExpression) {
    console.log(expression);
    this.myForm.patchValue({
      type: expression?.type,
      sharePrice: expression?.sharePrice,
      units: expression?.units,
      amount: expression?.amount,
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
      return;
    }
    const fd = {
      units: this.myForm.get('units').value,
      assetId: this.assetId
    };
    // this.APIResponse = false; this.submitting = false;
    this.apiService.post(`/api/v1/reservations/express-interest`, fd)
      .subscribe(response => {
        this.appService.userInformationObs()
          .subscribe(userDetail => {
            if(!userDetail.cscs) {
              Swal.fire({
                title: 'CSCS Details',
                text: "To make payment for this asset, you should have a CSCS Number. Do you have a CSCS Number?",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No, I don\'t'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigateByUrl(`/dashboard/shares/details/${response.data.reservation.id}/verify-cscs-number`)
                } else {
                  Swal.fire({
                    title: 'A CSCS account number would be created for you',
                    text: "Your CSCS number is mandatory to complete a transaction",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Proceed!',
                    cancelButtonText: 'Cancel'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.router.navigateByUrl(`/dashboard/shares/${response.data.reservation.id}/create-new-cscs`)
                    } else {
                      Swal.fire('Note', 'You can not complete this transaction without a CSCS Number.','error');
                    }
                  });
                }
              })
            }
          });
      },
      errResp => {
        this.submitting = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }

}