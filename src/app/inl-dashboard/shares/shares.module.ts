import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharesRoutingComponent } from './shares-routing.module';
import { SharesComponent } from './shares/shares.component';

import { ShareDetailComponent } from './share-detail/share-detail.component';
import { ExpressionComponent } from './expression/expression.component';
import { VerifyCscsComponent } from './cscs-verify/cscs-verify.component';
import { CscsCreateComponent } from './cscs-create/cscs-create.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '@app/_shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    SharesComponent,
    ShareDetailComponent,
    ExpressionComponent,
    VerifyCscsComponent,CscsCreateComponent
  ],
  imports: [
    CommonModule,
    SharesRoutingComponent,

    SharedModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule
  ]
})
export class SharesModule { }
