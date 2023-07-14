import { screen, waitFor } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

import { getApplication } from "../fixtures/getActiveApplication";
import { VehicleTypesAsString } from "../../../../../../manageVehicles/types/managevehicles";

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

export const chooseOption = async (user: UserEvent, select: HTMLElement, optionText: string) => {
  await user.click(select);
  const option = await screen.findByText(optionText, { selector: "li" });
  await user.click(option);
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

export const vehicleSubtypeOptions = async () => {
  return await screen.findAllByTestId("subtype-menu-item");
};

export const errMsgForVIN = async () => {
  return await screen.findByTestId("alert-permitData.vehicleDetails.vin");
};

export const errMsgForPlate = async () => {
  return await screen.findByTestId("alert-permitData.vehicleDetails.plate");
};

export const errMsgForMake = async () => {
  return await screen.findByTestId("alert-permitData.vehicleDetails.make");
};

export const errMsgForVehicleYear = async () => {
  return await screen.findByTestId("alert-permitData.vehicleDetails.year");
};

export const errMsgForVehicleCountry = async () => {
  return await screen.findByTestId("alert-permitData.vehicleDetails.countryCode");
};

export const errMsgForVehicleType = async () => {
  return await screen.findByTestId("alert-permitData.vehicleDetails.vehicleType");
};

export const errMsgForVehicleSubtype = async () => {
  return await screen.findByTestId("alert-permitData.vehicleDetails.vehicleSubType");
};

export const vinInput = async () => {
  return await screen.findByTestId("input-permitData.vehicleDetails.vin");
};

export const plateInput = async () => {
  return await screen.findByTestId("input-permitData.vehicleDetails.plate");
};

export const makeInput = async () => {
  return await screen.findByTestId("input-permitData.vehicleDetails.make");
};

export const vehicleYearInput = async () => {
  return await screen.findByTestId("input-permitData.vehicleDetails.year");
};

export const vehicleCountrySelect = async () => {
  return await screen.findByTestId("select-permitData.vehicleDetails.countryCode");
};

export const vehicleProvinceSelect = async () => {
  return await screen.findByTestId("select-permitData.vehicleDetails.provinceCode");
};

export const vehicleTypeSelect = async () => {
  return await screen.findByTestId("select-permitData.vehicleDetails.vehicleType");
};

export const vehicleSubtypeSelect = async () => {
  return await screen.findByTestId("select-permitData.vehicleDetails.vehicleSubType");
};

export const openVehicleSubtypeSelect = async (user: UserEvent) => {
  const subtypeSelect = await vehicleSubtypeSelect();
  await user.click(subtypeSelect);
};

export const chooseSaveVehicleToInventory = async (user: UserEvent, save: boolean) => {
  if (save) {
    const saveOption = await screen.findByTestId("save-vehicle-yes");
    await user.click(saveOption);
  } else {
    const dontSaveOption = await screen.findByTestId("save-vehicle-no");
    await user.click(dontSaveOption);
  }
};

export const unitNumberOrPlateSelect = async () => {
  return await screen.findByTestId("select-unit-or-plate");
};

export const vehicleSelect = async () => {
  return await screen.findByTestId("select-vehicle-autocomplete");
};

export const openVehicleSelect = async (user: UserEvent) => {
  const vehicleSelectEl = await vehicleSelect();
  await user.click(vehicleSelectEl);
};

export const vehicleOptions = async (vehicleType: VehicleTypesAsString) => {
  return await screen.findAllByTestId(`select-vehicle-option-${vehicleType}`);
};
