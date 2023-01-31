//import { ApiErrorResponse } from "../../../types/common";
//import { MANAGE_PROFILE_API } from "./endpoints/endpoints";

export interface ICompanyInfo {
  address: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  email: string;
  phone: string;
  fax: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  primaryPhone: string;
  alternatePhone: string;
  primaryCountry: string;
  primaryProvince: string;
  primaryCity: string;
}

const TEST_DATA: ICompanyInfo = {
  address: "4042 Robson Street",
  country: "Canada",
  province: "British Columbia",
  city: "Vancouver",
  postalCode: "V8R 3V6",
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

interface TEST {
  status: number;
}

export const getCompanyInfo = async (): Promise<ICompanyInfo> => {
  return TEST_DATA;
};

export const updateCompanyInfo = async (
  powerUnit: ICompanyInfo
): Promise<TEST> => {
  return { status: 200 };
};
