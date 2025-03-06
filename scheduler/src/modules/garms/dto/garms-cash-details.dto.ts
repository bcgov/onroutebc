import { StringDecoder } from "string_decoder";

export class GarmaCashDetail {
    //Set to 2
    recType: string;
    //Set to 14017
    agentNumber: string;
    //YYYYMMDD date of posting
    wsdate: string;
    //Set to 1 for first Detail record associated with header, length 4 format(9999)
    seqNumber: number;
    //SMARMS service code, length 4 format(9999)
    serviceCode: string;
    //total no. of services for service code, length 5 format(99999)
    serviceQuantity: number;
    //Set to 0, length 5
    invUnits: number;
    //Total Permit Fee Amount for Service Code, length 11. format (9999999V.99-)
    revAmount: number;
    //Set to 15 spaces
    serNoFrom: string;
    //Set to 15 spaces
    serNoTo: string;
    //set to space character
    voidInd: string;
    //Set to 66 space characters
    f1: StringDecoder;
  }
  