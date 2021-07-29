import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { InlWebsiteRoutingModule } from './inl-website-routing.module';
import { InlWebsiteComponent } from './inl-website.component';
import { SharedModule } from '../_shared/shared.module';
import { InlLoginComponent } from './login/inl-login.component';
import { InlAuthComponent } from './auth/inl-auth.component';
import { InlForgotPasswordComponent } from './forgot-password/inl-forgot-password.component';
import { InlResetPasswordComponent } from './reset-password/inl-reset-password.component';
import { InlSignupComponent } from './signup/inl-signup.component';
import { InlSignupContinueComponent } from './signup-continue/inl-signup-continue.component';
import { InlVerifyOtpComponent } from './verify-otp/inl-verify-otp.component';

import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    InlWebsiteComponent,
    InlAuthComponent,
    InlLoginComponent,
    InlForgotPasswordComponent,
    InlResetPasswordComponent,
    InlVerifyOtpComponent,
    InlSignupComponent,
    InlSignupContinueComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    MatGridListModule, MatFormFieldModule, MatProgressSpinnerModule,
    InlWebsiteRoutingModule
  ]
})
export class InlWebsiteModule { }
