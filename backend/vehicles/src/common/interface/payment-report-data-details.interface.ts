export interface IPaymentReportDataDetails {
  paymentMethod: string;
  orbcTransactionId: string;
  providerTransactionId: string;
  amount: number; //To be changed to Decimal.js
  receiptNo: string;
  permitType: string;
  permitNo: string;
  issuedOn: string;
}
