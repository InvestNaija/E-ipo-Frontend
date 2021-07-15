export const ValidationMessages  = {
  'bvn' : {
      'required': 'BVN is required',
  },
  'dob' : {
      'required': 'Date of birth is required',
  },
  // 'firstName' : {
  //     'required': 'First Name is required',
  // },
  // 'lastName' : {
  //     'required': 'Surname is required',
  // }
};
export let FormErrors = {
  bvn: '',
  dob: '',
  // firstName: '',
  // lastName: '',
};

export interface KYCDetail {
  bvn: string,
  dob: string,
  // firstName: string,
  // lastName: string,
}
