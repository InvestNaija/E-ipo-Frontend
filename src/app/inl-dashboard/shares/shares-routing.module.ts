import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShareDetailComponent } from './share-detail/share-detail.component';
import { ExpressionComponent } from './expression/expression.component';
import { VerifyCscsComponent } from './cscs-verify/cscs-verify.component';
import { CscsCreateComponent } from './cscs-create/cscs-create.component';
import { SharesComponent } from './shares/shares.component';

const routes: Routes = [
  {
    path: '',
    component: SharesComponent,
  },
  {
    path: 'details/:id/expression-of-interest',
    component: ExpressionComponent
  },
  {
    path: 'details/:id/expression-of-interest/:reservationId',
    component: ExpressionComponent
  },
  {
    path: 'details/:id/verify-cscs-number',
    component: VerifyCscsComponent
  },
  {
    path: 'details/:id',
    component: ShareDetailComponent
  },
  {
    path: ':id/create-new-cscs',
    component: CscsCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharesRoutingComponent { }
