import moment from 'moment';

export const formatAddress = (address, characters = 10) =>
  `${address.slice(0, characters)}...${address.slice(-characters)}`;

export const shortenString = (string, characters = 10) => `${string.slice(0, characters)}`;

export const shortenEmail = (email) => email.split('@')[0];

export const copy = (string) => navigator.clipboard.writeText(string);

export const formatDate = (date, format = 'DD/MM/YYYY HH:mm') => moment(date).format(format);

export const formatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 3,
});

export const formatAmount = (number, digits) => {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: digits,
  });

  return formatter.format(number);
};

export const formatTimeDigit = (digit) => (digit < 10 ? `0${digit}` : `${digit}`);
