import { NgModule } from '@angular/core';

import { TransactionsRoutingComponent } from './transactions-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BankPaymentComponent } from './make-payment/bank-payment.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '@app/_shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    DashboardComponent,
    TransactionsComponent,
    MakePaymentComponent, BankPaymentComponent
  ],
  imports: [
    TransactionsRoutingComponent,

    SharedModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatButtonModule,
    MatRadioModule, MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  exports: [
    TransactionsComponent
  ]
})
export class TransactionsModule { }
