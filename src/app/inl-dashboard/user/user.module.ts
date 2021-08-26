import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilePondModule, registerPlugin } from 'ngx-filepond';

import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { NoKComponent } from './nok/nok.component';
import { PasswordComponent } from './password/password.component';
import { SocialsComponent } from './socials/socials.component';
import { DocumentsComponent } from './documents/documents.component';
import { BankingDetailsComponent } from './banking-details/banking-details.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { KYCComponent } from './kyc/kyc.component';
import { SharedModule } from '../../_shared/shared.module';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop/dist/filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize/dist/filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform/dist/filepond-plugin-image-transform';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode/dist/filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize);

@NgModule({
  declarations: [
    UserComponent,
    ProfileComponent,
    PasswordComponent,
    NoKComponent,
    SocialsComponent,
    DocumentsComponent,
    BankingDetailsComponent,
    NotificationsComponent,
    KYCComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FilePondModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatIconModule
  ]
})
export class UserModule { }
