import { IPaymentReportDataDetails } from './payment-report-data-details.interface';

export interface IPaymentReportData {
  paymentReportData: IPaymentReportDataDetails[];
  totalAmount: number; //To be changed to Decimal.js
  paymentMethod: string;
}
