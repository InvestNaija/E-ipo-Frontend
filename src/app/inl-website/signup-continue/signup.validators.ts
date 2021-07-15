export const ValidationMessages  = {
  'firstName' : {
      'required': 'Firstname is required',
  },
  'lastName' : {
      'required': 'Lastname is required',
  },
  'gender' : {
      'required': 'Gender is required',
  },
  'phone' : {
      'required': 'Phone is required',
  },
  'birthdate' : {
      'required': 'Date of Birt is required',
  },
  'email' : {
      'required': 'Email is required',
      'email': 'The email field must be a valid email',
  },
  'bvn' : {
      'required': 'BVN is required',
  },
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
  'accept' : {
      'requiredTrue': 'Accept terms and conditions to proceed',
  },
};
export let FormErrors = {
  firstName: '',
  lastName: '',
  middleName: '',
  gender: '',
  phone: '',
  birthdate: '',
  email: '',
  bvn: '',
  address: '',
  signature: '',
  password: '',
  confirmPassword: '',
  accept: ''
};

export interface KYCDetail {
  firstname: string,
  lastname: string,
  middlename: string,
  gender: string,
  phone: string,
  birthdate: string,
  residence: {
    address1: string,
    lga: string,
    state: string
  },
  email: string,
  photo: string,
  nin: number,
  bvn: number,
  signature: string
}
