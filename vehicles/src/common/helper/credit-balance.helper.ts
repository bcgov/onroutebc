import { EGARM_CREDIT_API_SYSTEM_ID } from '../constants/api.constant';
import * as soap from 'soap';
import { EGARMSoapClient } from '../interface/egarms-soap-client.interface';


export const getEgarmsCreditBalance = async (clientNumber: string) => {
  return new Promise((resolve, reject) => {
    const username = process.env.EGARMS_CREDIT_API_USER;
    const password = process.env.EGARMS_CREDIT_API_PWD;
    const wsdlUrl = process.env.EGARMS_CREDIT_API_URL;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const strSystemId = EGARM_CREDIT_API_SYSTEM_ID;
    const strClientNo = clientNumber;
    // Set HTTP headers at client creation
    const clientOptions = {
      wsdl_options: {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    };
    soap.createClient(wsdlUrl, clientOptions, (err, client) => {
      if (err) {
        console.error('Error creating SOAP client:', err);
        return reject(err);
      }
      
      const typedSoapClient = client as unknown as EGARMSoapClient;
      typedSoapClient.setSecurity(new soap.BasicAuthSecurity(username, password));
      typedSoapClient.Send({ strSystemId, strClientNo }, (err, result) => {
        if (err) {
          console.error('Error calling Send method:', err);
          return reject(err);
        }
        resolve(result);
      });
    });
  });
};
