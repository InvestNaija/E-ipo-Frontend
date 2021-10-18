export const ValidationMessages  = {
  'name' : {
    'required': 'Name is required',
    'maxlength': 'Name cannot be longer than 50 characters'
  },
  'relationship' : {
    'required': 'Relationship is required',
  },
  'address' : {
    'required': 'Address is required',
    'maxlength': 'Name cannot be longer than 100 characters'
  },
  'phoneNumber' : {
    'required': 'Phone Number is required',
    'invalid': 'Should be a valid phone number',
    'maxlength': 'Phone cannot be longer than 12 characters'
  },
  'email' : {
    'required': 'Email is required',
    'invalid': 'The email field must be a valid email',
  },
};
export let FormErrors = {
  name: '',
  relationship: '',
  address: '',
  phoneNumber: '',
  email: '',
};

export interface Social {
  name: string,
  relationship: string,
  address: string,
  phoneNumber: string,
  email: string,
}
