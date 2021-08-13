import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject, Subscription, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ApplicationContextService {

  private _userInformation;
  private _userInformationObs = new BehaviorSubject(1);
  private _userSub: Subscription;

  constructor(
    private router: Router,
    ) { }

  public set userInformation(value) {
    this._userInformation = value;
    this._userInformationObs.next(value);
    // localStorage.setItem('learning-cp-dashboard-refresh', btoa(JSON.stringify(value)));
  }

  public get userInformation() {
    return this._userInformation;
  }

  userInformationObs(): Observable<any> {
    // if(localStorage.getItem('learning-cp-dashboard-refresh')) {
    //   this._userInformationObs.next(JSON.parse(atob(localStorage.getItem('learning-cp-dashboard-refresh'))));
    // }
    return this._userInformationObs.asObservable();
  }

  checkCSCS(txn: any) {
    this._userSub = this.userInformationObs()
          .subscribe(userDetail => {
            console.log(userDetail, userDetail.cscs, userDetail.cscsRef)
            if(!userDetail.cscs && !userDetail.cscsRef) {
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
                  if(this._userSub) this._userSub.unsubscribe();
                  this.router.navigateByUrl(`/dashboard/shares/details/${txn.id}/verify-cscs-number`)
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
                    if(this._userSub) this._userSub.unsubscribe();
                    if (result.isConfirmed) {
                      this.router.navigateByUrl(`/dashboard/shares/${txn.id}/create-new-cscs`)
                    } else {
                      Swal.fire('Note', 'You can not complete this transaction without a CSCS Number.','error');
                      if(txn.goToTxns){
                        this.router.navigateByUrl(`/dashboard/transactions`)
                      }
                    }
                  });
                }
              })
            } else {
              if(this._userSub) this._userSub.unsubscribe();
              this.router.navigateByUrl(`/dashboard/transactions/${txn.id}/${txn.asset.id}/make-payment`)
            }
          });
  }
}
