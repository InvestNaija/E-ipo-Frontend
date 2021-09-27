import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { ApiService } from '@app/_shared/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';


export interface PeriodicElement {
  position: number;
  course: string;
  courseFee: number;
  category: string;
  scheduled: string;
  published: string;
  status: string;
}

@Component({
  selector: 'in-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['asset', 'price', 'unitsExpressed', 'unitsAlloted', 'amount', 'createdAt', 'status', 'action'];
  dataSource: any = null;
  total_count = 0;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private api: ApiService,
    private appService: ApplicationContextService
  ) { }

  private loadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.loadingSubject.asObservable();

  ngOnInit(): void { }
  ngAfterViewInit() {
    this.getTransactions();
  }

  getTransactions() {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.dataSource = null;
          return this.api.get(`/api/v1/reservations/my-reservations`);
        }),
        map((response: any) => {
          // this.total_count = data.response.totalItems;
          return response.data.filter(o => o.asset.type.toLowerCase().includes('ipo'));
        }),
        catchError(() => {
          return of([]);
        })
      )
      .subscribe(response => {
        this.loadingSubject.next(false);
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
          return data.status.trim().toLowerCase() == filter;
        };
      });
  }

  getOpenForPayment(asset) {

    const today = new Date();
    const closingDate = new Date(asset.closingDate);
    if(today > closingDate) asset.openForPurchase = false;
    else asset.openForPurchase = true;

    return asset.openForPurchase;
  }

  onMakePayment(element: any) {
    this.router.navigateByUrl(`/dashboard/transactions/${element.id}/${element.asset.id}/make-payment`)
  }

  onEdit(element: any) {
    this.router.navigateByUrl(`/dashboard/shares/details/${element.asset.id}/expression-of-interest/${element.id}`)
  }

  onDeleteTransaction(element: any) {
    Swal.fire({
      title: 'Delete transaction',
      text: "Deleting transaction is irreversible action",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#06262D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        element.deleting=true;
        this.api.delete(`/api/v1/reservations/cancel/${element.id}`)
          .subscribe(response => {
            this.toastr.success(response.message);
            element.deleting=false;
            this.getTransactions();
          },errResp => {
            element.deleting=false;
          });
      }
    });
  }
}
