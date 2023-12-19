import { PointerEventsCheckLevel } from "@testing-library/user-event";
import dayjs from "dayjs";

import { DATE_FORMATS } from "../../../../../../../common/helpers/formatDate";
import {
  commoditiesInfoBox,
  commodityConditionLabel,
  commodityDescriptionLabel,
  dateOptions,
  durationOption,
  expiryDateElement,
  invalidFutureDateMessageElement,
  invalidPastDateMessageElement,
  lastMonthButton,
  nextMonthDateOptions,
  openDurationSelect,
  openStartDateSelect,
  optionalCommodityCheckboxes,
  requiredCommodityCheckboxes,
  selectDayFromDateOptions,
  selectDurationOption,
  selectNextMonth,
  toggleCheckbox,
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
  commodities,
  renderDefaultTestComponent,
  renderTestComponent,
  defaultDuration,
  allDurations,
  emptyCommodities,
  maxFutureYear,
  thisYear,
} from "./helpers/prepare";
import { getExpiryDate } from "../../../../../helpers/permitState";

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
    const { user } = renderDefaultTestComponent();

    // Act
    const { text: durationText, days: durationDays } =
      allDurations[allDurations.length - 1];
    await openDurationSelect(user);
    await selectDurationOption(user, durationText);

    // Assert
    const expectedExpiry = getExpiryDate(
      dayjs(currentDt), 
      durationDays
    ).format(DATE_FORMATS.SHORT);

    expect(await expiryDateElement(expectedExpiry)).toBeVisible();
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
    const shouldUseNextMonth = (maxFutureMonth > thisMonth) || (maxFutureYear > thisYear);
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
    const shouldUseNextMonth = (maxFutureMonth > thisMonth) || (maxFutureYear > thisYear);
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

  it("should display error message for invalid past start dates", async () => {
    // Arrange and Act
    renderTestComponent(
      dayjs(currentDt).subtract(1, "day"),
      defaultDuration,
      emptyCommodities,
    );
    // Assert
    expect(await invalidPastDateMessageElement()).toBeVisible();
  });

  it("should display error message for invalid future start dates (more than 14 days from today)", async () => {
    // Arrange and Act
    renderTestComponent(
      dayjs(currentDt).add(15, "day"),
      defaultDuration,
      emptyCommodities,
    );

    // Assert
    expect(await invalidFutureDateMessageElement()).toBeVisible();
  });

  it("should display correct expiry date after selecting start date", async () => {
    // Arrange
    const { user } = renderDefaultTestComponent();

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
      defaultDuration,
    ).format(DATE_FORMATS.SHORT);

    expect(await expiryDateElement(expectedExpiry)).toBeVisible();
  });
});

describe("Permit Details commodities", () => {
  it("should display commodities info box", async () => {
    // Arrange and Act
    renderTestComponent(currentDt, defaultDuration, commodities);

    // Assert
    expect(await commoditiesInfoBox()).toBeVisible();
  });

  it("should properly display commodities", async () => {
    // Arrange and Act
    renderTestComponent(currentDt, defaultDuration, commodities);

    // Assert - All commodities are present
    await Promise.all(
      commodities.map(
        async (commodity) =>
          await commodityDescriptionLabel(commodity.description),
      ),
    );
    await Promise.all(
      commodities.map(
        async (commodity) => await commodityConditionLabel(commodity.condition),
      ),
    );

    // Assert - Required commodities are checked and disabled
    const requiredCheckboxes = await requiredCommodityCheckboxes();
    const nonRequiredCheckboxes = await optionalCommodityCheckboxes();
    requiredCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
    });
    nonRequiredCheckboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBeDisabled();
    });
  });

  it("should be able to select non-required commodities", async () => {
    // Arrange
    const { user } = renderTestComponent(
      currentDt,
      defaultDuration,
      commodities,
    );

    const nonRequiredCheckboxes = await optionalCommodityCheckboxes();

    // Act
    await Promise.all(
      nonRequiredCheckboxes.map(async (checkbox) => {
        await toggleCheckbox(user, checkbox);
      }),
    );

    // Assert
    nonRequiredCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it("should not be able to deselect required commodities", async () => {
    // Arrange
    const { user } = renderTestComponent(
      currentDt,
      defaultDuration,
      commodities,
      {
        pointerEventsCheck: PointerEventsCheckLevel.Never,
      },
    );

    const requiredCheckboxes = await requiredCommodityCheckboxes();

    // Act
    await Promise.all(
      requiredCheckboxes.map(async (checkbox) => {
        await toggleCheckbox(user, checkbox);
      }),
    );

    // Assert
    requiredCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });
});
