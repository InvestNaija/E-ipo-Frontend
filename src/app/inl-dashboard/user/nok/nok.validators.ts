export const ValidationMessages  = {
  'name' : {
    'required': 'Name is required',
  },
  'relationship' : {
    'required': 'Relationship is required',
  },
  'address' : {
    'required': 'Address is required',
  },
  'phoneNumber' : {
    'required': 'Phone Number is required',
  },
  'email' : {
    'required': 'Email is required',
    'pattern': 'The email field must be a valid email',
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
