import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import {  BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  url = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  oneDigit = /\d/;
  oneLowerCase = /[a-z]/;
  oneUpperCase = /[A-Z]/;

  private loadingSubject = new BehaviorSubject<boolean>(null);
  isLoading$ = this.loadingSubject.asObservable();

  container: any = {};

  constructor(private api: ApiService) { }

  resetContainer() {
    this.container = {};
  }

  loading() {
    return this.loadingSubject;
  }

  getLOVs(endpoint: string, selectScope: string, options: any) {
    if (this.container[selectScope] == null) {
      this.container[options['loading']] = 'Loading, please wait...';
      return this.api.get(endpoint).pipe(
        map(response => {
            return of(response.data);
          }
        )
      )
          .subscribe(
            (response) => {
              this.container[options['loading']] = null;
              this.container[selectScope] = response;
            },
            (err) => {
              this.container[options['loading']] = null;
              console.log(err);
            }
          );
    }
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
    }
  }

  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }
  findInvalidControlsRecursive(formToInvestigate: FormGroup|FormArray): string[] {
    const invalidControls: any = {};
    const recursiveFunc = (form: FormGroup|FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid && !(control instanceof FormArray) && !(control instanceof FormGroup)) {
          invalidControls[field] = control.errors;
        }
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  controlnvalid(controlToInvestigate: FormControl): string[] {
    const invalidControls: any = {};
    if (controlToInvestigate.invalid ) {
      const controlName = (Object.keys(controlToInvestigate.parent.controls).find(key => controlToInvestigate.parent.controls[key] === controlToInvestigate))
      invalidControls[controlName] = controlToInvestigate.errors;
    }
    return invalidControls;
  }

  displayErrors(formErrors: any, ValidationMessages: any, errors: any, uiErrors: any) {
    Object.keys(formErrors).forEach((control) => {
      formErrors[control] = '';
    });
    Object.keys(errors).forEach((control) => {
      Object.keys(errors[control]).forEach(error => {
        uiErrors[control] = ValidationMessages[control][error];
      })
    });
    return {formErrors: formErrors, uiErrors: uiErrors};
  }
}
