export const ValidationMessages  = {
  'type' : {
    'required': 'Email is required',
  },
  'sharePrice' : {
    'required': 'Share price cannot be empty. Did you tamper with this field',
  },
  'units' : {
    'required': 'Number of Units is required',
    'min': 'Minimum number of units is 1',
  },
  'amount' : {
    'required': 'Amount is required.',
  }
};
export let FormErrors = {
  type: '',
  sharePrice: '',
  units: '',
  amount: '',
};

export interface IExpression {
  type: string,
  sharePrice: number,
  units: number,
  amount: number,
}
