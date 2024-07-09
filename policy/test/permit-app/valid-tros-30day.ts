import PermitApplication from './permit-application.type';

export const validTros30Day: PermitApplication = {
  permitType: 'TROS',
  permitData: {
    companyName: 'Sonic Delivery Services',
    clientNumber: 'B3-000102-466',
    permitDuration: 30,
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
    ],
    contactDetails: {
      firstName: 'Chief',
      lastName: 'Baker',
      phone1: '(250) 555-1234',
      phone1Extension: null,
      phone2: '(250) 555-4321',
      phone2Extension: null,
      email: 'chief.baker@gov.bc.ca',
      additionalEmail: 'baker.chief@gov.bc.ca',
      fax: null,
    },
    mailingAddress: {
      addressLine1: '940 Blanshard',
      addressLine2: null,
      city: 'Victoria',
      provinceCode: 'BC',
      countryCode: 'CA',
      postalCode: 'V8B1A2',
    },
    vehicleDetails: {
      vehicleId: '101',
      unitNumber: '321',
      vin: '654321',
      plate: 'D654321',
      make: 'Custom',
      year: 2010,
      countryCode: 'CA',
      provinceCode: 'BC',
      vehicleType: 'trailer',
      vehicleSubType: 'SEMITRL',
      saveVehicle: false,
    },
    feeSummary: '30',
    startDate: '2024-04-18',
    expiryDate: '2024-05-17',
  },
};
