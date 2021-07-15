import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ApiService } from '@app/_shared/services/api.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './nok.validators';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

@Component({
  selector: 'in-nok',
  templateUrl: './nok.component.html',
  styleUrls: ['./nok.component.scss']
})
export class NoKComponent implements OnInit {
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
        name: [this.appContext.userInformation?.nextOfKinName, [Validators.required]],
        relationship: [this.appContext.userInformation?.nextOfKinRelationship, [Validators.required]],
        address: [this.appContext.userInformation?.nextOfKinAddress, [Validators.required]],
        phoneNumber: [this.appContext.userInformation?.nextOfKinPhoneNumber, [Validators.required]],
        email: [this.appContext.userInformation?.nextOfKinEmail, [Validators.required, Validators.pattern(this.commonServices.email)]],
      });
    })
  }

  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(this.myForm.get(ctrlName) as FormControl);
    this.displayErrors();
  }

  onSubmit() {
    this.container['submitting'] = true;
    if (this.myForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
      this.errors = this.commonServices.findInvalidControlsRecursive(this.myForm);
      this.displayErrors();
      this.container['submitting'] = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.myForm.value));
    this.apiService.post('/api/v1/customers/next-of-kin', fd)
      .subscribe(response => {
        this.container['submitting'] = false;
        Swal.fire('Great!', response?.message, 'success')
      },
      errResp => {
        this.container['submitting'] = false;
        // Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
      });
  }

  displayErrors() {
    Object.keys(this.formErrors).forEach((control) => {
      this.formErrors[control] = '';
    });
    Object.keys(this.errors).forEach((control) => {
      Object.keys(this.errors[control]).forEach(error => {
        this.uiErrors[control] = ValidationMessages[control][error];
      })
    });
  }

}
