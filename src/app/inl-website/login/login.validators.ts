export const ValidationMessages  = {
  'email' : {
    'required': 'Email is required',
    'pattern': 'The email field must be a valid email',
  },
  'password' : {
    'required': 'Password is required',
    'minlength': 'Must be minimum of 6 characters',
    'maxlength': 'Maximum of 15 characters',
    'oneDigit': 'Must contain one digit',
    'oneLowerCase': 'Must contain one lowercase letter',
    'oneUpperCase': 'Must contain one uppercase letter',
    'specialChar': 'Must contain one special character e.g _, !, @, etc',
  }
};
export let FormErrors = {
  email: '',
  password: '',
};

export interface User {
  email: string,
  password: string,
}
