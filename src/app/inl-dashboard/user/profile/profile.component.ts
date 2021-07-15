import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ApiService } from '@app/_shared/services/api.service';
import { FormErrors, ValidationMessages } from './profile.validators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'in-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  myForm: FormGroup;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  loading: boolean;
  uploading = false; firstFile = 0;

  @ViewChild('myPond') myPond: any;
  pondFiles = [];
  pondOptions = {
    class: 'my-filepond',
    labelIdle: 'Drop files here',
    acceptedFileTypes: 'image/jpeg, image/png',
    imagePreviewHeight: 100,
    imageCropAspectRatio: '1:1',
    imageResizeTargetWidth: 130,
    imageResizeTargetHeight: 130,
    stylePanelLayout: 'compact circle',
    styleLoadIndicatorPosition: 'center bottom',
    styleProgressIndicatorPosition: 'right bottom',
    styleButtonRemoveItemPosition: 'left bottom',
    styleButtonProcessItemPosition: 'right bottom',
  };
  uploadedImage: string;

  container = {
    countries: [{code:'NG', name: 'Nigeria'}],countriesLoading:'Loading countries, please wait'
  }
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe
    ) { }

  ngOnInit(): void {
    this.loading = true;
    this.apiService.get('/api/v1/customers/profile/fetch')
      .subscribe(response => {
        this.loading = false;

        const user = response.data
        const dob = new Date(user.dob)
        this.myForm = this.fb.group({
          firstName: [{value: user.firstName, disabled:true}, [Validators.required]],
          lastName: [{value: user.lastName, disabled:true}, [Validators.required]],
          country: [{value: this.container.countries[0], disabled:true}, [Validators.required]],
          email: [{value: user.email, disabled:true}, [Validators.required]],
          dob: [{value: this.datePipe.transform(dob, 'dd-MMM-yyyy'), disabled:true}, [Validators.required]],
          phone: [{value: user.phone, disabled:true}, [Validators.required]],
        });
        if(user.image) {
          this.pondFiles.push(user.image);
        }
      },
      errResp => {
        this.loading = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }

  pondHandleInit() {
    console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log(this.firstFile)
    this.uploadedImage = event.file.getFileEncodeDataURL();
  }
  onUploadImage() {
    this.uploading = true;
    this.apiService.patch('/api/v1/customers/update-avatar', {image: this.uploadedImage})
      .subscribe(response => {
        this.uploading = false;
        Swal.fire('Great!', response?.message, 'success')
      },
      errResp => {
        this.uploading = false;
        Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      })
  }
}
