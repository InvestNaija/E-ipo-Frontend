import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { catchError, finalize, map, startWith, switchMap } from 'rxjs/operators';

import { ApiService } from '@app/_shared/services/api.service';

@Component({
  selector: 'in-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.scss']
})
export class SharesComponent implements OnInit  {

  shares: any;

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  private loadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.loadingSubject.asObservable();

  ngOnInit(): void {
    this.fetchShares().pipe(
      catchError(() => {
        return of([]);
      })
    ).subscribe(response => {
      this.loadingSubject.next(false);
      this.shares = response.data.filter(o => !o.currency.includes('USD'));
    });
  }
  onClickShares(share: any) {
    this.router.navigate(['dashboard','shares','details', share.id, 'expression-of-interest']);
  }
  fetchShares() {
    return this.api.get(`/api/v1/assets`);
  }
}
