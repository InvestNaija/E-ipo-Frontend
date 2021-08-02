import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './socials.validators';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

@Component({
  selector: 'in-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss']
})
export class SocialsComponent implements OnInit {
  myForm: FormGroup;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  container = {};

  constructor(
    private fb: FormBuilder,
    public commonServices: CommonService,
    private apiService: ApiService,
    private appContext: ApplicationContextService
    ) { }

  ngOnInit(): void {
    this.commonServices.isLoading$.subscribe(loading => {
      this.myForm = this.fb.group({
        facebook: [this.appContext.userInformation?.facebook, [Validators.pattern(this.commonServices.url)]],
        linkedIn: [this.appContext.userInformation?.linkedIn, [Validators.pattern(this.commonServices.url)]],
        twitter: [this.appContext.userInformation?.twitter, [Validators.pattern(this.commonServices.url)]],
        website: [this.appContext.userInformation?.website, [Validators.pattern(this.commonServices.url)]],
        youtube: [this.appContext.userInformation?.youtube, [Validators.pattern(this.commonServices.url)]],
      });
    })
  }
  onSubmit() {
    this.container['submitting'] = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      Object.keys(this.errors).forEach((control) => {
        Object.keys(this.errors[control]).forEach(error => {
          this.uiErrors[control] = ValidationMessages[control][error];
        })
      })
      this.container['submitting'] = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    this.apiService.patch('/api/v1/customers/update-profile', fd)
      .subscribe(response => {
        this.container['submitting'] = false;
        Swal.fire('Great!', response?.message, 'success')
      },
      errResp => {
        this.container['submitting'] = false;
        // Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }

}
