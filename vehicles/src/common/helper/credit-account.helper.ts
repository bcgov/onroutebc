import { CreditAccount } from '../../modules/credit-account/entities/credit-account.entity';
import {
  EGARMS_CREDIT_ACCOUNT_ACTIVE,
  EGARMS_CREDIT_ACCOUNT_EXCEED_LIMIT,
  EGARMS_CREDIT_ACCOUNT_EXCEED_LIMIT_2,
  EGARMS_CREDIT_ACCOUNT_HOLD,
} from '../constants/api.constant';
import { CreditAccountActivityType } from '../enum/credit-account-activity-type.enum';
import {
  CreditAccountStatus,
  CreditAccountStatusType,
  CreditAccountStatusValid,
} from '../enum/credit-account-status-type.enum';
import { IDIRUserRole } from '../enum/user-role.enum';
import { IEGARMSResponse } from '../interface/egarms-response.interface';
import { IUserJWT } from '../interface/user-jwt.interface';
import { doesUserHaveRole } from './auth.helper';

export const isActiveCreditAccount = (creditAccount: CreditAccount) => {
  return (
    creditAccount?.creditAccountStatusType ===
    CreditAccountStatus.ACCOUNT_ACTIVE
  );
};

export const isClosedCreditAccount = (creditAccount: CreditAccount) => {
  return (
    creditAccount?.creditAccountStatusType ===
    CreditAccountStatus.ACCOUNT_CLOSED
  );
};

export const isOnHoldCreditAccount = (creditAccount: CreditAccount) => {
  return (
    creditAccount?.creditAccountStatusType ===
    CreditAccountStatus.ACCOUNT_ON_HOLD
  );
};

export const getCreditAccountActivityType = (
  creditAccount: CreditAccount,
  statusToUpdateTo: CreditAccountStatusType,
) => {
  switch (statusToUpdateTo) {
    case CreditAccountStatusValid.ACCOUNT_ACTIVE:
      if (isClosedCreditAccount(creditAccount)) {
        return CreditAccountActivityType.ACCOUNT_REOPENED;
      } else if (isOnHoldCreditAccount(creditAccount)) {
        return CreditAccountActivityType.ACCOUNT_HOLD_REMOVED;
      }
      break;
    case CreditAccountStatusValid.ACCOUNT_ON_HOLD:
      return CreditAccountActivityType.ACCOUNT_ON_HOLD;
    case CreditAccountStatusValid.ACCOUNT_CLOSED:
      return CreditAccountActivityType.ACCOUNT_CLOSED;
  }
};

export const isHideLimitDetails = (
  mapBasedonRole: boolean,
  currentUser: IUserJWT,
  egarmsCreditAccountDetails: IEGARMSResponse,
) => {
  return (
    (mapBasedonRole &&
      doesUserHaveRole(currentUser?.orbcUserRole, [
        IDIRUserRole.PPC_CLERK,
        IDIRUserRole.CTPO,
      ])) ||
    !validEgarmsReturnCodesToDisplayCreditDetails(egarmsCreditAccountDetails)
  );
};

export const validEgarmsReturnCodesToDisplayCreditDetails = (
  egarmsCreditAccountDetails: IEGARMSResponse,
) => {
  return (
    egarmsCreditAccountDetails?.PPABalance?.return_code ===
      EGARMS_CREDIT_ACCOUNT_ACTIVE ||
    egarmsCreditAccountDetails?.PPABalance?.return_code ===
      EGARMS_CREDIT_ACCOUNT_HOLD ||
    egarmsCreditAccountDetails?.PPABalance?.return_code ===
      EGARMS_CREDIT_ACCOUNT_EXCEED_LIMIT ||
    egarmsCreditAccountDetails?.PPABalance?.return_code ===
      EGARMS_CREDIT_ACCOUNT_EXCEED_LIMIT_2
  );
};
