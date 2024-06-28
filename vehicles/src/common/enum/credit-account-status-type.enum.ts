export const CreditAccountStatus = {
  ACCOUNT_ON_HOLD: 'ONHOLD',
  ACCOUNT_ACTIVE: 'ACTIVE',
  ACCOUNT_CLOSED: 'CLOSED',
  ACCOUNT_SETUP_FAIL: 'SETUP_FAIL',
} as const;

export type CreditAccountStatusType =
  (typeof CreditAccountStatus)[keyof typeof CreditAccountStatus];

//   // New type that extends CreditAccountStatusType but omits ACCOUNT_SETUP_FAIL
// export type CreditAccountStatusValidType = Omit<CreditAccountStatusType, 'ACCOUNT_SETUP_FAIL'>;

// Manually constructing the CreditAccountStatusValidType as a const
export const CreditAccountStatusValid = {
  ACCOUNT_ON_HOLD: CreditAccountStatus.ACCOUNT_ON_HOLD,
  ACCOUNT_ACTIVE: CreditAccountStatus.ACCOUNT_ACTIVE,
  ACCOUNT_CLOSED: CreditAccountStatus.ACCOUNT_CLOSED,
} as const;

export type CreditAccountStatusValidType =
  (typeof CreditAccountStatus)[keyof typeof CreditAccountStatusValid];
