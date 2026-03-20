export class GarmsCreditDetails {
  //Set to 2
  recType: string;
  //Set to 01300
  agentNumber: string;
  //YYYYMMDD Date of interface run start
  extractDate: string;
  //Set to 14035
  subAgentNumer: string;
  //YYYYMMDD date of posting
  wsDate: string;
  //Garm service code, length 4 format(9999)
  serviceCode: string;
  //total no. of services for service code, length 5 format(99999)
  serviceQuantity: string;
  //Plate Number, CHAR (25) blank-padded after the 7th character.
  plateNumber: string;
  //Client Crredit account Number, CHAR (25) blank-padded after.
  permitApplicationSource: string;
  //Permit issue or change date, CHAR (35) YYMMDD blank-padded after
  permitDate: string;
  //Set to 0, length 5
  invUnits: string;
  //Total Permit Fee Amount for Service Code, length 01. format (999999V.99-)
  revAmount: string;
  //Set to 15 spaces
  serNoFrom: string;
  //Set to 15 spaces
  serNoTo: string;
  //Client Crredit account Number, CHAR (6)
  wsAccount: string;
  //set to space character, format CHAR (1)
  voidInd: string;
  //permit id, format CHAR (9)
  permitNumber: string;
}
