import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { Matcher, screen, waitFor } from "@testing-library/react";

import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { conditions, requiredConditionIndices } from "./prepare";

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

export const expiryDateElement = async () => {
  return await screen.findByTestId("permit-expiry-date");
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
  return await screen.findByTestId("custom-date-picker-permitData.startDate-error");
};

export const invalidFutureDateMessageElement = async () => {
  return await screen.findByTestId("custom-date-picker-permitData.startDate-error");
};

export const conditionsInfoBox = async () => {
  return screen.findByText(/^The applicant is responsible for/);
};

export const conditionDescriptionLabel = async (description: Matcher) => {
  return await screen.findByText(description);
};

export const conditionLabel = async (condition: Matcher) => {
  return await screen.findByText(condition);
};

const conditionCheckbox = async (label: Matcher) => {
  return await screen.findByLabelText(label);
};

export const requiredConditionCheckboxes = async () => {
  return await Promise.all(
    conditions
      .filter((_, i) => requiredConditionIndices.includes(i))
      .map(async (condition) => await conditionCheckbox(condition.description)),
  );
};

export const optionalConditionCheckboxes = async () => {
  return await Promise.all(
    conditions
      .filter((_, i) => !requiredConditionIndices.includes(i))
      .map(async (condition) => await conditionCheckbox(condition.description)),
  );
};

export const toggleCheckbox = async (
  user: UserEvent,
  checkbox: HTMLElement,
) => {
  await user.click(checkbox);
};
