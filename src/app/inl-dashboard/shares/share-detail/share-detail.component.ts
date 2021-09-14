import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { IShare } from '../../_models/share.model';
import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';

@Component({
  selector: 'in-share-detail',
  templateUrl: './share-detail.component.html',
  styleUrls: ['./share-detail.component.scss']
})
export class ShareDetailComponent implements OnInit {

  @Output() termsRead = new EventEmitter<boolean>();
  @Input() share: IShare;

  paying = false;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    private api: ApiService,
    public commonServices: CommonService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.aRoute.paramMap.pipe(
      switchMap(params => {
        this.commonServices.loading().next(true);
        return this.api.get(`/api/v1/assets/${params.get('id')}`);
      })
    ).subscribe(response => {
      this.commonServices.loading().next(false);
      // this.share = response.data;

      const today = new Date();
      const closingDate = new Date(this.share.closingDate);
      if(today > closingDate) this.share.openForPurchase = false;
      else this.share.openForPurchase = true;
    })
    this.termChecked(true);
  }

  termChecked(value: boolean) {
    this.termsRead.emit(value);
  }

  onExpressInterest(share: IShare, terms: boolean) {
    this.paying = true;

    // if(!terms) {
    //   this.paying = false;
    //   this.toastr.error('Terms and Condition needs to be accepted', '500: Error');
    //   return;
    // }
    this.router.navigateByUrl(`/dashboard/shares/details/${share.id}/expression-of-interest`)
  }
}
