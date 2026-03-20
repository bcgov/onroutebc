import dayjs from "dayjs";

import { DATE_FORMATS } from "../../../../../../../common/helpers/formatDate";
import { getExpiryDate } from "../../../../../helpers/permitState";
import {
  conditionsInfoBox,
  conditionLabel,
  conditionDescriptionLabel,
  dateOptions,
  durationOption,
  expiryDateElement,
  lastMonthButton,
  nextMonthDateOptions,
  openDurationSelect,
  openStartDateSelect,
  optionalConditionCheckboxes,
  requiredConditionCheckboxes,
  selectDayFromDateOptions,
  selectDurationOption,
  selectNextMonth,
} from "./helpers/access";

import {
  currentDt,
  tomorrow,
  day,
  thisMonth,
  daysInCurrMonth,
  tomorrowDay,
  maxFutureMonth,
  maxFutureDay,
  daysInFutureMonth,
  conditions,
  renderDefaultTestComponent,
  renderTestComponent,
  defaultDuration,
  allDurations,
  maxFutureYear,
  thisYear,
} from "./helpers/prepare";

describe("Permit Details duration", () => {
  it("should have available durations to select", async () => {
    // Arrange
    const { user } = renderDefaultTestComponent();

    // Act
    await openDurationSelect(user);

    // Assert - all options are available
    const durationOptions = await Promise.all(
      allDurations.map(async (duration) => await durationOption(duration.text)),
    );
    durationOptions.forEach((option) => {
      expect(option).toBeVisible();
    });
  });

  it("should display correct expiry date after selecting duration", async () => {
    // Arrange
    const { text: durationText, days: durationDays } =
      allDurations[allDurations.length - 1];
      
    const { user } = renderTestComponent(
      dayjs(currentDt),
      durationDays,
      [],
    );

    // Act
    await openDurationSelect(user);
    await selectDurationOption(user, durationText);

    // Assert
    const expectedExpiry = getExpiryDate(
      dayjs(currentDt),
      false, // only non-quarterly permits have selectable duration list
      durationDays,
    ).format(DATE_FORMATS.SHORT);

    expect(await expiryDateElement()).toHaveTextContent(expectedExpiry);
  });
});

describe("Permit Details start date", () => {
  it("should have disabled date options before today", async () => {
    // Arrange
    const { user } = renderDefaultTestComponent();

    // Act
    await openStartDateSelect(user);

    // Assert
    const datesThisMonth = await dateOptions();
    const thisMonthBeforeTodayOptions = datesThisMonth.filter(
      (option) => Number(option.textContent) < day,
    );

    const disabledOptions = thisMonthBeforeTodayOptions.filter((option) =>
      option.hasAttribute("disabled"),
    );

    expect(await lastMonthButton()).toBeDisabled();
    expect(disabledOptions.length).toBe(day - 1);
  });

  it("should have disabled date options after 14 days from today", async () => {
    // Arrange
    const { user } = renderDefaultTestComponent();

    // Act
    await openStartDateSelect(user);

    // Assert
    const shouldUseNextMonth =
      maxFutureMonth > thisMonth || maxFutureYear > thisYear;
    if (shouldUseNextMonth) {
      await selectNextMonth(user);

      const datesNextMonth = await nextMonthDateOptions();
      const datesAfterMaxFutureDay = datesNextMonth.filter(
        (option) => Number(option.textContent) > maxFutureDay,
      );
      const disabledOptions = datesAfterMaxFutureDay.filter((option) =>
        option.hasAttribute("disabled"),
      );
      expect(disabledOptions.length).toBe(daysInFutureMonth - maxFutureDay);
    } else {
      const datesThisMonth = await dateOptions();
      const datesAfterMaxFutureDay = datesThisMonth.filter(
        (option) => Number(option.textContent) > maxFutureDay,
      );
      const disabledOptions = datesAfterMaxFutureDay.filter((option) =>
        option.hasAttribute("disabled"),
      );
      expect(disabledOptions.length).toBe(daysInFutureMonth - maxFutureDay);
    }
  });

  it("should accept start dates with 14 days from today", async () => {
    // Arrange
    const { user } = renderDefaultTestComponent();

    // Act
    await openStartDateSelect(user);

    // Assert
    const shouldUseNextMonth =
      maxFutureMonth > thisMonth || maxFutureYear > thisYear;
    if (shouldUseNextMonth) {
      // First find this month's active days
      const thisMonthDates = await dateOptions();
      const remainingDaysThisMonth = thisMonthDates.filter(
        (option) => Number(option.textContent) >= day,
      );

      const activeDatesThisMonth = remainingDaysThisMonth.filter(
        (option) => !option.hasAttribute("disabled"),
      );

      expect(activeDatesThisMonth.length).toBe(daysInCurrMonth - day + 1);

      // Next, check active dates for next month
      await selectNextMonth(user);
      const nextMonthDates = await nextMonthDateOptions();
      const availableDatesNextMonth = nextMonthDates.filter(
        (option) => Number(option.textContent) <= maxFutureDay,
      );

      const activeDatesNextMonth = availableDatesNextMonth.filter(
        (option) => !option.hasAttribute("disabled"),
      );

      expect(activeDatesNextMonth.length).toBe(maxFutureDay);
    } else {
      const datesThisMonth = await dateOptions();
      const availableDates = datesThisMonth.filter(
        (option) =>
          Number(option.textContent) >= day &&
          Number(option.textContent) <= maxFutureDay,
      );

      const activeDates = availableDates.filter(
        (option) => !option.hasAttribute("disabled"),
      );

      expect(activeDates.length).toBe(1 + 14); // today and next 14 days
    }
  });

  it("should display correct expiry date after selecting start date", async () => {
    // Arrange
    const { user } = renderTestComponent(
      dayjs(tomorrow),
      defaultDuration,
      [],
    );

    // Act
    await openStartDateSelect(user);
    if (tomorrowDay < day) {
      await selectNextMonth(user);
      const nextMonthDates = await nextMonthDateOptions();
      await selectDayFromDateOptions(user, tomorrowDay, nextMonthDates);
    } else {
      const datesThisMonth = await dateOptions();
      await selectDayFromDateOptions(user, tomorrowDay, datesThisMonth);
    }

    // Assert
    const expectedExpiry = getExpiryDate(
      dayjs(tomorrow),
      false, // non-quarterly permit being used as test data
      defaultDuration,
    ).format(DATE_FORMATS.SHORT);

    expect(await expiryDateElement()).toHaveTextContent(expectedExpiry);
  });
});

describe("Permit Details conditions", () => {
  it("should display conditions info box", async () => {
    // Arrange and Act
    renderTestComponent(currentDt, defaultDuration, conditions);

    // Assert
    expect(await conditionsInfoBox()).toBeVisible();
  });

  it("should properly display conditions", async () => {
    // Arrange and Act
    renderTestComponent(currentDt, defaultDuration, conditions);

    // Assert - All conditions are present
    await Promise.all(
      conditions.map(
        async (condition) =>
          await conditionDescriptionLabel(condition.description),
      ),
    );
    await Promise.all(
      conditions.map(
        async (condition) => await conditionLabel(condition.condition),
      ),
    );

    // Assert - Required conditions are checked and disabled
    const requiredCheckboxes = await requiredConditionCheckboxes();
    const nonRequiredCheckboxes = await optionalConditionCheckboxes();
    requiredCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
    });
    nonRequiredCheckboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBeDisabled();
    });
  });
});
