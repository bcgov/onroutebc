import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { Matcher, screen, waitFor } from "@testing-library/react";

import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { commodities, requiredCommodityIndices } from "./prepare";

export const openDurationSelect = async (
  user: UserEvent,
  durationSelectText?: string,
) => {
  const durationSelect = await screen.findByText(
    getDefaultRequiredVal("30 Days", durationSelectText),
  );
  await user.click(durationSelect);
};

export const durationOption = async (durationOptionText: string) => {
  return await screen.findByText(durationOptionText, { selector: "li" });
};

export const selectDurationOption = async (
  user: UserEvent,
  durationOptionText: string,
) => {
  const option = await durationOption(durationOptionText);
  await user.click(option);
};

export const expiryDateElement = async (expiryDateText: Matcher) => {
  return await screen.findByText(expiryDateText);
};

export const openStartDateSelect = async (user: UserEvent) => {
  const startDateSelect = await screen.findByTestId("CalendarIcon");
  await user.click(startDateSelect);
};

export const lastMonthButton = async () => {
  return await screen.findByTitle(/Previous month/i);
};

export const nextMonthButton = async () => {
  return await screen.findByTitle(/Next month/i);
};

export const selectNextMonth = async (user: UserEvent) => {
  const selectNextMonthButton = await nextMonthButton();
  await user.click(selectNextMonthButton);
};

export const dateOptions = async () => {
  const dateCells = await screen.findAllByRole("gridcell");
  return dateCells.filter(
    (cell) =>
      cell.textContent &&
      Number(cell.textContent) >= 1 &&
      Number(cell.textContent) <= 31,
  );
};

export const nextMonthDateOptions = async () => {
  await waitFor(async () => {
    // There's a period of time where all cells for both last month and this month are shown,
    // so we need to wait for last month cells to disappear
    const dateCells = await dateOptions();
    expect(dateCells.length).toBeLessThanOrEqual(31);
  });

  return await dateOptions();
};

export const selectDayFromDateOptions = async (
  user: UserEvent,
  day: number,
  dateOptions: HTMLElement[],
) => {
  const option = dateOptions.find((cell) => cell.textContent === String(day));
  if (option) {
    await user.click(option);
  }
};

export const invalidPastDateMessageElement = async () => {
  return await screen.findByText(/^Start date cannot be in the past/i);
};

export const invalidFutureDateMessageElement = async () => {
  return await screen.findByText(/^Start date must be within 14 days/i);
};

export const commoditiesInfoBox = async () => {
  return screen.findByText(/^The applicant is responsible for/);
};

export const commodityDescriptionLabel = async (description: Matcher) => {
  return await screen.findByText(description);
};

export const commodityConditionLabel = async (condition: Matcher) => {
  return await screen.findByText(condition);
};

const commodityCheckbox = async (label: Matcher) => {
  return await screen.findByLabelText(label);
};

export const requiredCommodityCheckboxes = async () => {
  return await Promise.all(
    commodities
      .filter((_, i) => requiredCommodityIndices.includes(i))
      .map(async (commodity) => await commodityCheckbox(commodity.description)),
  );
};

export const optionalCommodityCheckboxes = async () => {
  return await Promise.all(
    commodities
      .filter((_, i) => !requiredCommodityIndices.includes(i))
      .map(async (commodity) => await commodityCheckbox(commodity.description)),
  );
};

export const toggleCheckbox = async (
  user: UserEvent,
  checkbox: HTMLElement,
) => {
  await user.click(checkbox);
};
