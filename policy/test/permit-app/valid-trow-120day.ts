import PermitApplication from './permit-application.type';

export const validTrow120Day: PermitApplication = {
  permitType: 'TROW',
  permitData: {
    companyName: 'Chief, Master',
    doingBusinessAs: 'DBA test 1233',
    clientNumber: 'B3-000102-187',
    permitDuration: 120,
    commodities: [
      {
        description: 'General Permit Conditions',
        condition: 'CVSE-1000',
        conditionLink:
          'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251',
        checked: true,
        disabled: true,
      },
      {
        description: 'Permit Scope and Limitation',
        condition: 'CVSE-1070',
        conditionLink:
          'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261',
        checked: true,
        disabled: true,
      },
      {
        description: 'Highways and Restrictive Load Limits',
        condition: 'CVSE-1011',
        conditionLink:
          'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1258',
        checked: true,
        disabled: true,
      },
    ],
    contactDetails: {
      firstName: 'Arbiter',
      lastName: 'Flood',
      phone1: '(250) 555-1234',
      phone1Extension: null,
      phone2: null,
      phone2Extension: null,
      email: 'arbiter.flood@gov.bc.ca',
      additionalEmail: 'flood.arbiter@gov.bc.ca',
      fax: null,
    },
    mailingAddress: {
      addressLine1: '1000 Main Street',
      addressLine2: null,
      city: 'Victoria',
      provinceCode: 'BC',
      countryCode: 'CA',
      postalCode: 'V8V 8V8',
    },
    vehicleDetails: {
      vehicleId: '108',
      unitNumber: '-',
      vin: '898989',
      plate: 'V6R4E3',
      make: 'FORD',
      year: 2007,
      countryCode: 'US',
      provinceCode: 'ME',
      vehicleType: 'powerUnit',
      vehicleSubType: 'GRADERS',
      saveVehicle: false,
    },
    feeSummary: '120',
    startDate: '2024-05-15',
    expiryDate: '2024-09-11',
  },
};
