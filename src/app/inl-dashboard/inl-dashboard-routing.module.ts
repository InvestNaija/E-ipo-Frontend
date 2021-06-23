import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InlDashboardComponent } from './inl-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AuthGuard } from '../shared/guards/auth.guard';

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
        path: 'courses',
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
      },
      {
        path: 'messages',
        loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule),
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
