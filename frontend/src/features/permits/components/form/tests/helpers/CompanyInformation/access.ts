import { screen } from "@testing-library/react";

export const headerTitle = async () => {
  return await screen.findByTestId("company-info-header-title");
};

export const headerDescription = async () => {
  return await screen.findByTestId("company-info-header-desc");
};

export const mailAddrTitle = async () => {
  return await screen.findByTestId("company-mail-addr-title");
};

export const mailAddrLine1 = async () => {
  return await screen.findByTestId("company-mail-addr-line1");
};

export const mailAddrCountry = async () => {
  return await screen.findByTestId("company-mail-addr-country");
};

export const mailAddrProvince = async () => {
  return await screen.findByTestId("company-mail-addr-prov");
};

export const mailAddrCityPostal = async () => {
  return await screen.findByTestId("company-mail-addr-city-postal");
};
