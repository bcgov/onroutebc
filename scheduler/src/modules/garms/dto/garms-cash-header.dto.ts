export class GarmaCashHeader {
  //Set to 1
  recType: string;
  //Set to 14017
  agentNumber: string;
  //YYYYMMDD date of posting
  wsdate: string;
  //total number of detail record, length 6 format(999999)
  recCount: string;
  //total Amount, length 11. format (9999999V.99-)
  revAmount: string;
  //Cash Amount, length 11. format (9999999V.99-)
  totalCashAmount: string;
  //Cheque Amount, length 11. format (9999999V.99-)
  totalChequeAmount: string;
  //Debit Card Amount, length 11. format (9999999V.99-)
  totalDebitCardAmount: string;
  //Visa Amount, length 11. format (9999999V.99-)
  totalVisaAmount: string;
  //Master Card Amount, length 11. format (9999999V.99-)
  totalMasterCardAmount: string;
  //Amex Amount, length 11. format (9999999V.99-)
  totalAmexAmount: string;
  //US Dollar Amount, length 11. format (9999999V.99-)
  totalUSAmount: string;
  // US Exchage Amount, length 11. format (9999999V.99-)
  totalUSExchangeAmount: string;
  //GA Amount, length 11. format (9999999V.99-)
  totalGAAmount: string;
  //total number of services, length 5 format(999999)
  serviceQuantity: string;
  //set to 0 length 5
  invQuantity: string;
}
