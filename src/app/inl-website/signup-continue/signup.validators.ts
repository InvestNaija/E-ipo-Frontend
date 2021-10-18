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
  'mothersMaidenName' : {
      'required': 'Mother Maiden Name is required',
  },
  'placeOfBirth' : {
      'required': 'Place Of Birth is required',
  },
  'password' : {
    'required': 'Password is required',
    'minlength': 'Must be minimum of 6 characters',
    'maxlength': 'Maximum of 15 characters',
    'oneDigit': 'Must contain one digit',
    'oneLowerCase': 'Must contain one lowercase letter',
    'oneUpperCase': 'Must contain one uppercase letter',
    'specialChar': 'Must contain one special character e.g _, !, @, etc',
  },
  'confirmPassword' : {
    'required': 'Confirm Password is required',
    'mustMatch': 'Password  and Confirm passord fields do not match',
  },
  'accept' : {
      'requiredTrue': 'Accept terms and conditions to proceed',
  },
  'bypassDND' : {
      'requiredTrue': 'BypassDND',
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
  bvn: '', mothersMaidenName: '', placeOfBirth: '',
  address: '',
  signature: '',
  password: '',
  confirmPassword: '',
  accept: '',
  bypassDND: '',
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
  residentialAddress: string,
  email: string,
  photo: string,
  nin: number,
  bvn: number, mothersMaidenName: string, placeOfBirth: string,
  signature: string,
  accept: boolean,
  bypassDND: boolean,
}
