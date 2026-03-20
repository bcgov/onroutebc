export class GarmsCreditHeader {
  //Set to 1
  recType: string;
  //Set to 01300
  agentNumber: string;
  //YYYYMMDD Date of interface run start
  extractDate: string;
  //HHMMSS (24 hour clock) Time of interface run start
  extractTime: string;
  //total number of permits , length 4. format (9999)
  transactionCount: string;
  //total number of permits , length 5. format (99999)
  servicecount: string;
  //set to 0 length 5
  invQuantity: string;
  //total amount, length 11 format(9999999V.99-)
  revAmount: string;
  //Set to 137 spaces
  f1: string;
}
