export const ValidationMessages  = {
  'facebook' : {
    'pattern': 'Pattern does not match a URL; e.g http://example.com',
  },
  'linkedIn' : {
    'pattern': 'Pattern does not match a URL; e.g http://example.com',
  },
  'twitter' : {
    'pattern': 'Pattern does not match a URL; e.g http://example.com',
  },
  'website' : {
    'pattern': 'Pattern does not match a URL; e.g http://example.com',
  },
  'youtube' : {
    'pattern': 'Pattern does not match a URL; e.g http://example.com',
  },
};
export let FormErrors = {
  facebook: '',
  linkedIn: '',
  twitter: '',
  website: '',
  youtube: '',
};

export interface Social {
  facebook: string,
  linkedIn: string,
  twitter: string,
  website: string,
  youtube: string,
}
