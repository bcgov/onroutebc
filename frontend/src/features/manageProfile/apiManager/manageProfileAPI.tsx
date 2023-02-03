interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

interface Contact {
  firstName: string;
  lastName: string;
  phone1: string;
  phone1Extension?: string;
  phone2?: string;
  phone2Extension?: string;
  email: string;
  city: string;
  province: string;
  country: string;
}

export interface CompanyProfile {
  clientNumber: string;
  companyLegalName: string;
  companyAddress: Address;
  companyAddressSameAsMailingAddress: boolean;
  mailingAddress?: Address;
  companyEmail: string;
  companyPhone: string;
  companyExtensionNumber?: string;
  companyFaxNumber?: string;
  primaryContact: Contact;
}

export const TEST_DATA: CompanyProfile = {
  clientNumber: "2023-87456",
  companyLegalName: "Bandstra Transportation Systems Ltd.",
  companyAddress: {
    addressLine1: "4042 Robson Street",
    city: "Vancouver",
    province: "British Columbia",
    country: "Canada",
    postalCode: "V8R 3V6",
  },
  companyAddressSameAsMailingAddress: true,
  companyEmail: "test@test.ca",
  companyPhone: "1 (778) 798 2367",
  primaryContact: {
    firstName: "Elias",
    lastName: "Lindholm",
    phone1: "1 (403) 456 7890",
    email: "elias@flames.ca",
    city: "Calgary",
    province: "Alberta",
    country: "Canada",
  },
};

interface TestResponse {
  status: number;
}

export const getCompanyInfo = async (): Promise<CompanyProfile> => {
  return TEST_DATA;
};

export const updateCompanyInfo = async (
  test: CompanyProfile
): Promise<TestResponse> => {
  console.log(test);
  return { status: 200 };
};
