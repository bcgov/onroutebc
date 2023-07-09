import { screen, waitFor } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

import { getApplication } from "../fixtures/getActiveApplication";

export const inputWithValue = async (val: string) => {
  return await screen.findByDisplayValue(val);
};

export const sendPermitToEmailMsg = async () => {
  return await screen.findByText(/The permit will be sent to the email/i);
};

export const replaceValueForInput = async (user: UserEvent, input: HTMLElement, offset: number, newVal: string) => {
  await user.click(input);
  await user.pointer([{target: input, offset: 0, keys: '[MouseLeft>]'}, { offset }]);
  await user.paste(newVal);
};

export const saveApplication = async (user: UserEvent) => {
  const saveBtn = await screen.findByTestId("save-application-button");
  await user.click(saveBtn);
};

export const continueApplication = async (user: UserEvent) => {
  const continueBtn = await screen.findByTestId("continue-application-button");
  await user.click(continueBtn);
};

export const getSavedApplication = async () => {
  await waitFor(() => {
    expect(getApplication()).not.toBeUndefined();
  });
  return getApplication();
};

export const errMsgForFirstName = async () => {
  return await screen.findByTestId("alert-permitData.contactDetails.firstName");
};

export const errMsgForLastName = async () => {
  return await screen.findByTestId("alert-permitData.contactDetails.lastName");
};

export const errMsgForPhone1 = async () => {
  return await screen.findByTestId("alert-permitData.contactDetails.phone1");
};

export const errMsgForEmail = async () => {
  return await screen.findByTestId("alert-permitData.contactDetails.email");
};

export const applicationNumberDisplay = async () => {
  return await screen.findByTestId("application-number");
};

export const applicationCreatedDateDisplay = async () => {
  return await screen.findByTestId("application-created-date");
};

export const applicationUpdatedDateDisplay = async () => {
  return await screen.findByTestId("application-updated-date");
};

export const companyNameDisplay = async () => {
  return await screen.findByTestId("company-banner-name");
};

export const companyClientNumberDisplay = async () => {
  return await screen.findByTestId("company-banner-client");
};
