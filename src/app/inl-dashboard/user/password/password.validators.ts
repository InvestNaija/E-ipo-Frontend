export const ValidationMessages  = {
  'oldPassword' : {
    'required': 'Password is required',
    'minlength': 'Must be minimum of 6 characters',
    'maxlength': 'Maximum of 15 characters',
    'oneDigit': 'Must contain one digit',
    'oneLowerCase': 'Must contain one lowercase letter',
    'oneUpperCase': 'Must contain one uppercase letter',
    'specialChar': 'Must contain one special character e.g _, !, @, etc',
  },
  'newPassword' : {
    'required': 'Password is required',
    'minlength': 'Must be minimum of 6 characters',
    'maxlength': 'Maximum of 15 characters',
    'oneDigit': 'Must contain one digit',
    'oneLowerCase': 'Must contain one lowercase letter',
    'oneUpperCase': 'Must contain one uppercase letter',
    'specialChar': 'Must contain one special character e.g _, !, @, etc',
  },
  'confirmNewPassword' : {
      'required': 'Confirm Password is required',
      'minlength': 'Confirm Password must be at least 6 characters',
      'mustMatch': 'Password  and Confirm passord fields do not match',
  }
};
export let FormErrors = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export interface User {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string,
}
