import { BamboraPaymentMethod, CardType } from "./PaymentMethod";
import { TransactionType } from "./payment";

export interface PermitHistory {
  permitNumber: string;
  comment: string;
  transactionAmount: number;
  transactionType: TransactionType;
  transactionOrderNumber: string;
  providerTransactionId: number;
  paymentMethod: BamboraPaymentMethod | null;
  cardType: CardType | null;
}
