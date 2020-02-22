export const formatCpf = (value: string) => {
  return value.replace(/(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})/, '$1.$2.$3-$4');
};

export const isCpf = (value: string) => {
  let sum = 0;

  value = value.replace(/\D/g, '');

  if (value.length !== 11) {
    return false;
  }

  const digits = value.split('').map(digit => +digit);

  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  if (sum % 11 >= 2 && 11 - (sum % 11) !== digits[9]) {
    return false;
  }

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }

  if (sum % 11 >= 2 && 11 - (sum % 11) !== digits[10]) {
    return false;
  }

  return true;
};
