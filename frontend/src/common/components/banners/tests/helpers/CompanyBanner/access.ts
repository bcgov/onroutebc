import { screen } from "@testing-library/react";

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
