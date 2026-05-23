const USD_TO_INR_RATE = 83;

export const convertUsdToInr = (amountUsd) => {
  const value = Number(amountUsd || 0);
  return value * USD_TO_INR_RATE;
};

export const formatInr = (amountUsd) => {
  const amountInr = convertUsdToInr(amountUsd);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amountInr);
};
