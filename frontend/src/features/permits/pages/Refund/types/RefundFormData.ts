import { 
  BamboraPaymentMethod, 
  CardType, 
  RefundMethod, 
} from "../../../types/PaymentMethod";

export interface RefundFormData {
  shouldUsePrevPaymentMethod: boolean;
  refundMethod: RefundMethod;
  refundOnlineMethod: BamboraPaymentMethod | "";
  refundCardType: CardType | "";
  transactionId?: string;
}
