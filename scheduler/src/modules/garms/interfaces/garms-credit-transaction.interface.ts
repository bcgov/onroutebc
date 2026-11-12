import { PermitIssuedBy } from '@common/enum/permit-issued-by.enum';
import { TransactionType } from '@common/enum/transaction-type.enum';
import { ApplicationStatus } from '@app/common/enum/application-status.enum';
import { PermitType } from '@app/common/enum/permit-type.enum';
import { CreditFileTransactionType } from '@common/enum/credit-file-transaction-type.enum';

export interface GarmsCreditTransaction {
  creditTransactionType: CreditFileTransactionType;
  transactionId?: string;
  transactionApprovedDate?: Date;
  paymentDepositDate?: Date;
  transactionTypeId: TransactionType;
  transactionAmount: number;
  permitType?: PermitType;
  serviceCode?: number;
  plateNumber?: string;
  permitIssuedBy?: PermitIssuedBy;
  revision?: number;
  permitStatus?: ApplicationStatus;
  permitIssueDateTime?: Date;
  permitNumber?: string;
  creditAccountNumber?: string;
}
