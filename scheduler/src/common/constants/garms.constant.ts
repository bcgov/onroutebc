export const SER_NO_FROM = ' '.repeat(15);
export const SER_NO_TO = ' '.repeat(15);
export const VOID_IND = ' '.repeat(1);
export const GARMS_CASH_FILLER =' '.repeat(66);;
export const INV_UNITS = '00000';
export const INV_QTY = '00000';
export const AGENT_NUMBER = '14035';
export const DETAIL_REC_TYPE = '2';
export const HEADER_REC_TYPE = '1';
export const US_AMOUNT = '0000000.00 ';
export const US_EXC_AMOUNT = '0000000.00 ';
export const GARMS_DATE_FORMAT = 'YYYYMMDD';

export const GARMS_CASH_FILE_LOCATION = '.GA4701.WS.BATCH(+1)';
export const GARMS_CREDIT_FILE_LOCATION = '.GA4702.WSCREDIT.INPUT(+1)';
export const GARMS_CASH_FILE_LRECL = 140;
export const GARMS_CREDIT_FILE_LRECL = 182;
// Constants group
export const GARMS_CONFIG = {
  agentNumber: AGENT_NUMBER,
  headerRecType: HEADER_REC_TYPE,
  detailRecType: DETAIL_REC_TYPE,
  usAmount: US_AMOUNT,
  usExchangeAmount: US_EXC_AMOUNT,
  filler: GARMS_CASH_FILLER,
  invQuantity: INV_QTY,
  invUnits: INV_UNITS,
  serNoFrom: SER_NO_FROM,
  serNoTo: SER_NO_TO,
  voidInd: VOID_IND,
};
