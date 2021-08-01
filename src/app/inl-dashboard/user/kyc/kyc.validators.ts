export const ValidationMessages  = {
  'bankCode' : {
    'required': 'Please select a bank',
  },
  'nuban' : {
      'required': 'NUBAN is required',
      'minlength': 'NUBAN must be at least 10 characters',
      'maxlength': 'NUBAN cannot be more than 10 characters',
      'pattern': 'Must be valid NUBAN digits',
  },
  'password' : {
      'required': 'Password is required',
      'minlength': 'Password must be at least 6 characters',
  },
  'motherMaidenName' : {
    'required': 'Enter your mother maiden name',
  },
  'placeOfBirth' : {
    'required': 'Enter your place of birth',
  },
};
export let FormErrors = {
  bankCode: '',
  nuban: '',
  bankName: '',
  bankAccountName: '',
  password: '',
  motherMaidenName: '',
  placeOfBirth: '',
};

export interface User {
  bankCode: string,
  nuban: string,
  bankName: string,
  bankAccountName: string,
  password: string,
  motherMaidenName: string,
  placeOfBirth: string,
}
