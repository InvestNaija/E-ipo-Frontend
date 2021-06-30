import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { InlDashboardRoutingModule } from './inl-dashboard-routing.module';
import { InlDashboardComponent } from './inl-dashboard.component';

// Feature Module
import { DashboardModule } from './dashboard/dashboard.module';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../_shared/shared.module';


@NgModule({
  declarations: [
    InlDashboardComponent
  ],
  imports: [
    CommonModule,
    InlDashboardRoutingModule,
    DashboardModule,
    IonicModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class InlDashboardModule { }
