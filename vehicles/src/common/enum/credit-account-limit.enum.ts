export const CreditAccountLimit = {
  PREPAID: 'PREPAID',
  500: '500',
  1000: '1000',
  2000: '2000',
  5000: '5000',
  7500: '7500',
  10000: '10000',
  15000: '15000',
  20000: '20000',
  30000: '30000',
  40000: '40000',
  50000: '50000',
  60000: '60000',
  70000: '70000',
  80000: '80000',
  90000: '90000',
  100000: '100000',
} as const;

export type CreditAccountLimitType =
  (typeof CreditAccountLimit)[keyof typeof CreditAccountLimit];
