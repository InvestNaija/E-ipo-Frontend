export const ValidationMessages  = {
  'password' : {
    'required': 'Password is required',
    'minlength': 'Must be minimum of 6 characters',
    'oneDigit': 'Must contain one digit',
    'oneLowerCase': 'Must contain one lowercase letter',
    'oneUpperCase': 'Must contain one uppercase letter',
  },
  'confirmPassword' : {
    'required': 'Confirm Password is required',
    'mustMatch': 'Password  and Confirm passord fields do not match',
  },
};
export let FormErrors = {
  password: '',
  confirmPassword: '',
};

export interface User {
  password: string,
  confirmPassword: string,
}
