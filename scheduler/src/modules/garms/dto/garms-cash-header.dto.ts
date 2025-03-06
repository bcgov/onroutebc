export class GarmaCashHeader {
    //Set to 1
    recType: string;
    //Set to 14017
    agentNumber: string;
    //YYYYMMDD date of posting
    wsdate: string;
    //total number of detail record, length 6 format(999999)
    recCount: number;
    //total Amount, length 11. format (9999999V.99-)
    revAmount: number;
    //Cash Amount, length 11. format (9999999V.99-)
    totalCashAmount: number;
    //Cheque Amount, length 11. format (9999999V.99-)
    totalChequeAmount: number;
    //Debit Card Amount, length 11. format (9999999V.99-)
    totalDebitCardAmount: number;
    //Visa Amount, length 11. format (9999999V.99-)
    totalVisaAmount: number;
    //Master Card Amount, length 11. format (9999999V.99-)
    totalMasterCardAmount: number;
    //Amex Amount, length 11. format (9999999V.99-)
    totalAmexAmount: number;
    //US Dollar Amount, length 11. format (9999999V.99-)
    totalUSAmount: number;
    // US Exchage Amount, length 11. format (9999999V.99-)
    totalUSExchangeAmount: number;
    //GA Amount, length 11. format (9999999V.99-)
    totalGAAmount: number;
    //total number of services, length 5 format(999999)
    serviceQuantity: number;
    //set to 0 length 5
    invQuantity: number;
  }
  