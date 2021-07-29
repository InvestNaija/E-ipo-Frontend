export const ValidationMessages  = {
  'email' : {
    'required': 'Email is required',
    'email': 'The email field must be a valid email',
  }
};
export let FormErrors = {
  email: '',
};

export interface User {
  email: string,
}
