import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { combineLatest, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';

import { IShare } from '../../_models/share.model';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

@Component({
  selector: 'in-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit, OnDestroy {

  initSubscription$: Subscription;

  paying = false;
  share: IShare;
  asset: any;
  transaction: any;

  routeAsset: string;
  routeTxn: string;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    private apiService: ApiService,
    private appContext: ApplicationContextService,
    public commonServices: CommonService,
    @Inject(DOCUMENT) private document: Document
    ) { }

  ngOnInit(): void {
    // Get Asset details
    // Check if KYC data is complete
    this.initSubscription$ = this.aRoute.paramMap.pipe(
        switchMap(params => {
          return this.appContext.userInformationObs()
              .pipe(
                  map(user => {
                    console.log(user);

                    if (!user.bankCode || !user.nuban || user.bankCode == '' || user.nuban == '') {
                      console.log(user.bankCode, user.nuban);
                      localStorage.setItem('making-payment', JSON.stringify({id: params.get('txnId'), asset: {id: params.get('assetId')}}));
                      Swal.fire('Error', 'Your settlement bank information is not available. Please complete to continue.','error');
                      this.router.navigateByUrl(`/dashboard/user/banks`);
                    }
                  }),
                  switchMap(user => {
                      this.commonServices.loading().next(true);
                    return combineLatest([
                              // Name of the asset
                              this.apiService.get(`/api/v1/assets/${params.get('assetId')}`),
                              // expression of Interest Id
                              this.apiService.get(`/api/v1/reservations/fetch/${params.get('txnId')}`)

                    ]);
                  })
                )
        })
    ).subscribe(([asset, transaction]) => {
      this.commonServices.loading().next(false);
        console.log(asset, transaction);
        this.asset = asset.data;
        this.transaction = transaction.data;
    });

  }
  onMakePayment(terms) {
    this.paying = true;
    if(!terms) {
      this.paying = false;
      Swal.fire('', 'Terms and Condition needs to be accepted', 'warning');
      return;
    }
    const payload = {
      gateway: environment.gateway,
      reservationId: this.transaction.id,
      currency: this.asset.currency
    }
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

  ngOnDestroy(): void {
    if(this.initSubscription$) {
      this.initSubscription$.unsubscribe();
    }
  }
}
