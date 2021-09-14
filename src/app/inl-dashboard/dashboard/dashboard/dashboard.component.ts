import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';

import { ApiService } from '@app/_shared/services/api.service';
import { Router } from '@angular/router';
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
  selector: 'in-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['asset', 'price', 'unitsExpressed', 'amount', 'status', 'action'];
  dataSource: any = null;
  userInformation: any;

  total_count = 0;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private loadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.loadingSubject.asObservable();
  topAssets: any;
  bestAsset = { loading: true, value: null };
  totalPortfolio = { loading: true, value: [] };

  constructor(
    private router: Router,
    private api: ApiService,
    private appService: ApplicationContextService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.api.get('/api/v1/assets/top-assets')
      .subscribe(response => {
        this.topAssets = response.data.filter(o => o.type.toLowerCase().includes('ipo'))
        this.bestAsset.loading = false
        this.bestAsset.value = this.topAssets.reduce(function (prev, current) {
          return (prev.sharePrice > current.sharePrice) ? prev : current
        })
      });
  }

  ngAfterViewInit() {
    this.getTransactions();
  }

  getTransactions() {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.dataSource = null;
          // return this.fetchCourses(this.paginator.pageIndex, this.paginator.pageSize);
          return this.fetchTxns();
        }),
        map((response: any) => {
          // this.total_count = data.response.totalItems;
          // console.log(data)
          // return response.data.filter(o => !o.asset.type.toLowerCase().includes('fund'));
          return response.data;
        }),
        catchError(() => {
          return of([]);
        })
      )
      .subscribe(response => {
        this.totalPortfolio.loading = false;
        // console.log(response);

        let result = [];
        response
        // .reduce((acc, curr) => {
        //   if (curr.asset.type.toLowerCase() !== 'ipo') acc.push(curr);
        //   return acc;
        // }, [])
        // .reduce(o => {
        //   // console.log(o.asset.type);

        //   return o.asset.type.toLowerCase().includes('ipo')
        // })
        .reduce(function (res, value) {
          // console.log(res);

          if (value.paid && value.asset.type.toLowerCase().includes('ipo')) {
            if (!res[value.asset.currency]) {
              res[value.asset.currency] = { currency: value.asset.currency, amount: 0 };
              result.push(res[value.asset.currency])
            }
            res[value.asset.currency].amount += value.amount;
          }
          return res;
        }, {});
        console.log(response);

        if (result.length === 0) {
          result.push({ currency: null, amount: 0 });
        }

        const tableData = response.filter(o => o.asset.type.toLowerCase().includes('ipo'));
        // console.log(tableData, response);

        this.totalPortfolio.value = result;
        this.loadingSubject.next(false);
        this.dataSource = new MatTableDataSource(tableData);

        this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
          return data.status.trim().toLowerCase() == filter;
        };
      });
  }
  fetchTxns() {
    return this.api.get(`/api/v1/reservations/my-reservations`);
  }
  onMakePayment(element: any) {
    this.appService.checkCSCS(element);
  }

  deleting = false;
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
        this.deleting = true;
        this.api.delete(`/api/v1/reservations/cancel/${element.id}`)
          .subscribe(response => {
            this.toastr.success(response.message);
            this.deleting = false;
            this.getTransactions();
          }, errResp => {
            this.deleting = false;
          });
      }
    });
  }
}
