import { screen } from "@testing-library/react";

export const title = async () => {
  return await screen.findByTestId("application-title");
};

export const applicationNumber = async () => {
  return await screen.findByTestId("application-number");
};

export const createdDate = async () => {
  return await screen.findByTestId("application-created-date");
};

export const updatedDate = async () => {
  return await screen.findByTestId("application-updated-date");
};
