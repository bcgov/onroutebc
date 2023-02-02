export interface ICompanyInfo {
  address1: string;
  address2?: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;

  mail_address1?: string;
  mail_address2?: string;
  mail_country?: string;
  mail_province?: string;
  mail_city?: string;
  mail_postalCode?: string;

  email?: string;
  phone: string;
  ext?: string;
  fax?: string;

  firstName: string;
  lastName: string;
  primaryEmail: string;
  primaryPhone: string;
  primaryPhoneExt?: string;
  alternatePhone?: string;
  alternatePhoneExt?: string;
  primaryCountry?: string;
  primaryProvince?: string;
  primaryCity: string;
}

const TEST_DATA: ICompanyInfo = {
  address1: "4042 Robson Street",
  country: "Canada",
  province: "British Columbia",
  city: "Vancouver",
  postalCode: "V8R 3V6",
  mail_country: "",
  mail_province: "",
  email: "test@test.ca",
  phone: "1 (778) 798 2367",
  fax: "",
  firstName: "Elias",
  lastName: "Lindholm",
  primaryEmail: "primary@test.ca",
  primaryPhone: "1 (403) 456 7890",
  alternatePhone: "",
  primaryCountry: "Canada",
  primaryProvince: "Alberta",
  primaryCity: "Calgary",
};

interface TestResponse {
  status: number;
}

export const getCompanyInfo = async (): Promise<ICompanyInfo> => {
  return TEST_DATA;
};

export const updateCompanyInfo = async (
  test: ICompanyInfo
): Promise<TestResponse> => {
  console.log(test);
  return { status: 200 };
};
