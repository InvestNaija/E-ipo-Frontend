import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InlAuthComponent } from './auth/inl-auth.component';
import { InlSignupComponent } from './signup/inl-signup.component';
import { InlSignupContinueComponent } from './signup-continue/inl-signup-continue.component';
import { InlForgotPasswordComponent } from './forgot-password/inl-forgot-password.component';
import { InlResetPasswordComponent } from './reset-password/inl-reset-password.component';
// import { InlWebsiteComponent } from './inl-website.component';
import { InlLoginComponent } from './login/inl-login.component';
import { SignupGuard } from './signup.guard';
import { InlVerifyOtpComponent } from './verify-otp/inl-verify-otp.component';

const routes: Routes = [
    { path: 'auth', component: InlAuthComponent,
    children: [
      { path: 'login', component: InlLoginComponent },
      { path: 'forgot-password', component: InlForgotPasswordComponent },
      { path: 'reset-password', component: InlResetPasswordComponent },
      { path: 'signup', component: InlSignupComponent },
      { path: 'signup-continue', canActivate: [SignupGuard],
          component: InlSignupContinueComponent },
      { path: 'verify-otp', canActivate: [SignupGuard],
          component: InlVerifyOtpComponent },
      { path: '', redirectTo: '/auth/login', pathMatch: 'full'},
    ]
   },
   { path: '', redirectTo: '/auth/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InlWebsiteRoutingModule { }
