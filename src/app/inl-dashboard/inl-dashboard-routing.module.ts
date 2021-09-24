import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InlDashboardComponent } from './inl-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AuthGuard } from '../_shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: InlDashboardComponent,
    // canActivateChild: [AuthGuard],
    children: [
      {
        path: 'index',
        component: DashboardComponent
      },
      {
        path: 'shares',
        loadChildren: () => import('./shares/shares.module').then(m => m.SharesModule),
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule),
      },
      {
        path: 'portfolio',
        loadChildren: () => import('./portfolio/portfolio.module').then(m => m.PortfolioModule),
      },
      {
        path: 'faq',
        loadChildren: () => import('./faq/faq.module').then(m => m.FAQModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
      },
      { path: '', redirectTo: 'index', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InlDashboardRoutingModule { }
