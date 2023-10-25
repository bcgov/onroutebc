import { BamboraPaymentMethod, CardType } from "./PaymentMethod";
import { TransactionType } from "./payment";

export interface PermitHistory {
  permitNumber: string;
  comment: string | null;
  commentUsername: string;
  transactionAmount: number;
  transactionOrderNumber: string;
  pgTransactionId: string | null;
  pgPaymentMethod: BamboraPaymentMethod | null;
  pgCardType: CardType | null;
  transactionTypeId: TransactionType;
  permitId: number;
  transactionSubmitDate: string | null;
}
