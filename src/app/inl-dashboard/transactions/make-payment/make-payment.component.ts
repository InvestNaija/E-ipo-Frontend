import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';

import {MatDialog} from '@angular/material/dialog';

import { IShare } from '../../_models/share.model';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { BankPaymentComponent } from './bank-payment.component';
import { ToastrService } from 'ngx-toastr';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

@Component({
  selector: 'in-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

  container = {'reinvest':true};
  reinvestList = [
    {"name": "Scrip (Reinvest your dividends/distributions and compound your returns)", ID: "D1", "checked": true},
    {"name": "Cash distribution (Collect your dividend)", ID: "D2", "checked": false}
  ]
  paying = false;
  share: IShare;
  asset: any;
  transaction: any;

  constructor(
    private aRoute: ActivatedRoute,
    private apiService: ApiService,
    public commonServices: CommonService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private appService: ApplicationContextService,
    @Inject(DOCUMENT) private document: Document
    ) { }

  ngOnInit(): void {
    // Get Asset details
    this.aRoute.paramMap.pipe(
      switchMap(params => {
        this.commonServices.loading().next(true);
        return combineLatest([
                  // Name of the asset
                  this.apiService.get(`/api/v1/assets/${params.get('assetId')}`),
                  // expression of Interest Id
                  this.apiService.get(`/api/v1/reservations/fetch/${params.get('txnId')}`)

        ]);
      })
    ).subscribe(([asset, transaction]) => {
      this.commonServices.loading().next(false);
        this.asset = asset.data;
        this.transaction = transaction.data;

        const userDetail = this.appService.userInformation;
        if(!userDetail.cscs && !userDetail.cscsRef)
          this.appService.checkCSCS({id: this.transaction.id, asset: this.asset, goToTxns: true});

    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(BankPaymentComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onMakePayment(terms) {
    this.paying = true;
    if(!terms) {
      this.paying = false;
      this.toastr.error('Terms and Condition needs to be accepted', 'Error');
      return;
    }
    // this.router.navigateByUrl(`/dashboard/transactions`);
    const getUrl = window.location;
    const payload = {
      gateway: environment.gateway,
      reservationId: this.transaction.id,
      currency: this.asset.currency,
      reinvest: this.container['reinvest'],
      redirectURL: getUrl.protocol + "//" + getUrl.host + "/dashboard/transactions"
    }
    // console.log(payload); return;

    this.apiService.post('/api/v1/reservations/make-payment', payload)
      .subscribe(response => {
        this.paying = false;
        this.document.location.href = response.data.authorization_url;
      },
      errResp => {
        this.paying = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }
}
