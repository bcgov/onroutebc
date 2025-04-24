import * as soap from 'soap';

export interface EGARMSoapClient {
  Send(
    input: { strSystemId: string; strClientNo: string },
    callback: (err: unknown, result: unknown) => void,
  ): void;
  setSecurity(security: soap.BasicAuthSecurity): void;
}
