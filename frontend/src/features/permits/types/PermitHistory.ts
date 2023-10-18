import { BamboraPaymentMethod, CardType } from "./PaymentMethod";
import { TransactionType } from "./payment";

export interface PermitHistory {
  permitNumber: string;
  comment: string | null;
  commentUsername: string;
  transactionAmount: number;
  transactionOrderNumber: string;
  pgTransactionId: string;
  pgPaymentMethod: BamboraPaymentMethod | null;
  pgCardType: CardType | null;
  transactionTypeId: TransactionType;
  permitId: number;
}
