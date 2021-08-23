import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { BackbuttonComponent } from './components/backbutton/backbutton.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    BackbuttonComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
      autoDismiss: true
    }),
  ],
  exports: [
    CommonModule, RouterModule, ToastrModule,
    MatIconModule, BackbuttonComponent,
    FormsModule, ReactiveFormsModule,
    NgSelectModule
  ]
})
export class SharedModule { }
