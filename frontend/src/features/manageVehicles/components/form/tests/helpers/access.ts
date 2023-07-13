import { screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

export const clickSubmit = async (user: UserEvent) => {
  const submitButton = await screen.findByRole("button", { name: /Add To Inventory/i });
  await user.click(submitButton);
};

export const unitNumberInput = async () => {
  return await screen.findByRole("textbox", {
    name: /unitNumber/i,
  });
};

export const makeInput = async () => {
  return await screen.findByRole("textbox", {
    name: /make/i,
  });
};

export const yearInput = async () => {
  return await screen.findByRole("spinbutton", {
    name: /year/i,
  });
};

export const vinInput = async () => {
  return await screen.findByRole("textbox", {
    name: /vin/i,
  });
};

export const plateInput = async () => {
  return await screen.findByRole("textbox", {
    name: /plate/i,
  });
};

export const trailerTypeCodeSelect = async () => {
  return await screen.findByTestId("select-trailerTypeCode");
};

export const powerUnitTypeCodeSelect = async () => {
  return await screen.findByTestId("select-powerUnitTypeCode");
};

export const countrySelect = async () => {
  return await screen.findByTestId("select-countryCode");
};

export const provinceSelect = async () => {
  return await screen.findByTestId("select-provinceCode");
};

export const emptyTrailerWidthInput = async () => {
  return await screen.findByRole("textbox", {
    name: /emptyTrailerWidth/i,
  });
};

export const licensedGvwInput = async () => {
  return await screen.findByRole("spinbutton", {
    name: /licensedGvw/i,
  });
};

export const steerAxleTireSizeInput = async () => {
  return await screen.findByRole("textbox", {
    name: /steerAxleTireSize/i,
  });
};

export const selectOptionsAndButtons = async () => {
  return await screen.findAllByRole("button");
};

export const textInputs = async () => {
  return await screen.findAllByRole("textbox");
};

export const numericInputs = async () => {
  return await screen.findAllByRole("spinbutton");
};

export const vinErrorDisplay = async () => {
  return await screen.findByTestId("alert-vin");
};

export const replaceValueForInput = async (user: UserEvent, input: HTMLElement, offset: number, newVal: string) => {
  await user.click(input);
  await user.pointer([{target: input, offset: 0, keys: '[MouseLeft>]'}, { offset }]);
  await user.paste(newVal);
};

export const submitErrorsDisplay = async () => {
  return await screen.findByTestId("alert", { exact: false });
};

export const chooseOption = async (user: UserEvent, select: HTMLElement, optionText: string) => {
  await user.click(select);
  const option = await screen.findByText(optionText);
  await user.click(option);
};
