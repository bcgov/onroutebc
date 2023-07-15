import { screen } from "@testing-library/react";

export const reviewConfirmWarning = async () => {
  return await screen.findByText("Please review and confirm that the information below is correct.");
};

export const companyInfoHeaderTitle = async () => {
  return await screen.findByTestId("company-info-header-title");
};

export const companyInfoHeaderDescription = async () => {
  return await screen.findByTestId("company-info-header-desc");
};

export const applicationHeaderTitle = async () => {
  return await screen.findByTestId("application-title");
};

export const applicationNumber = async () => {
  return await screen.findByTestId("application-number");
};

export const applicationCreatedDate = async () => {
  return await screen.findByTestId("application-created-date");
};

export const applicationUpdatedDate = async () => {
  return await screen.findByTestId("application-updated-date");
};

export const companyNameLabel = async () => {
  return await screen.findByTestId("company-banner-name-label");
};

export const companyName = async () => {
  return await screen.findByTestId("company-banner-name");
};

export const companyClientLabel = async () => {
  return await screen.findByTestId("company-banner-client-label");
};

export const companyClientNumber = async () => {
  return await screen.findByTestId("company-banner-client");
};

export const companyMailAddrHeaderTitle = async () => {
  return await screen.findByTestId("company-mail-addr-title");
};

export const companyMailAddrLine1 = async () => {
  return await screen.findByTestId("company-mail-addr-line1");
};

export const companyMailAddrCountry = async () => {
  return await screen.findByTestId("company-mail-addr-country");
};

export const companyMailAddrProvince = async () => {
  return await screen.findByTestId("company-mail-addr-prov");
};

export const companyMailAddrCityPostal = async () => {
  return await screen.findByTestId("company-mail-addr-city-postal");
};

export const contactInfoHeaderTitle = async () => {
  return await screen.findByTestId("review-contact-details-title");
};

export const contactInfoName = async () => {
  return await screen.findByTestId("review-contact-details-name");
};

export const contactInfoPhone1 = async () => {
  return await screen.findByTestId("review-contact-details-phone1");
};

export const contactInfoPhone2 = async () => {
  return await screen.findByTestId("review-contact-details-phone2");
};

export const contactInfoEmail = async () => {
  return await screen.findByTestId("review-contact-details-email");
};

export const contactInfoFax = async () => {
  return await screen.findByTestId("review-contact-details-fax");
};
