import { FormProvider, useForm } from "react-hook-form";
import { PermitDetails } from "../PermitDetails";
import { DATE_FORMATS, now } from "../../../../../../common/helpers/formatDate";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import dayjs from "dayjs";
import { TROS_COMMODITIES } from "../../../../constants/termOversizeConstants";

const currentDt = now();
const tomorrow = dayjs(currentDt).add(1, "day");
const day = currentDt.date();
const thisMonth = currentDt.month();
const daysInCurrMonth = currentDt.daysInMonth();
const tomorrowDay = tomorrow.date();
const maxFutureDate = dayjs(currentDt).add(14, "day");
const maxFutureMonth = maxFutureDate.month();
const maxFutureDay = maxFutureDate.date();
const daysInFutureMonth = maxFutureDate.daysInMonth();

const commodities = [...TROS_COMMODITIES];

const TestFormWrapper = (props: React.PropsWithChildren) => {
  const formMethods = useForm({
    defaultValues: {
      permitData: {
        startDate: currentDt,
        permitDuration: 30,
        expiryDate: currentDt,
        commodities: [],
      }
    },
    reValidateMode: "onBlur",
  });

  return (
    <FormProvider {...formMethods}>
      {props.children}
    </FormProvider>
  );
};

describe("Permit Details duration", () => {
  it("should have available durations to select", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={30}
          commodities={[]}
        />
      </TestFormWrapper>
    );

    // Act
    const durationSelect = await screen.findByText("30 Days");
    await user.click(durationSelect);

    // Assert - all options are available
    expect(await screen.findByText("30 Days", { selector: "li" })).toBeVisible();
    expect(await screen.findByText("60 Days")).toBeVisible();
    expect(await screen.findByText("90 Days")).toBeVisible();
    expect(await screen.findByText("120 Days")).toBeVisible();
    expect(await screen.findByText("150 Days")).toBeVisible();
    expect(await screen.findByText("180 Days")).toBeVisible();
    expect(await screen.findByText("210 Days")).toBeVisible();
    expect(await screen.findByText("240 Days")).toBeVisible();
    expect(await screen.findByText("270 Days")).toBeVisible();
    expect(await screen.findByText("300 Days")).toBeVisible();
    expect(await screen.findByText("330 Days")).toBeVisible();
    expect(await screen.findByText("1 Year")).toBeVisible();
  });

  it("should display correct expiry date after selecting duration", async () => {
    // Arrange
    const user = userEvent.setup();
    const duration = 30;
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={duration}
          commodities={[]}
        />
      </TestFormWrapper>
    );

    // Act
    const durationSelect = await screen.findByText("30 Days");
    await user.click(durationSelect);
    const yearOption = await screen.findByText("1 Year");
    await user.click(yearOption);

    // Assert
    const expectedExpiry = dayjs(currentDt).add(365 - 1, "day").format(DATE_FORMATS.SHORT);
    expect(await screen.findByText(expectedExpiry)).toBeVisible();
  });
});

describe("Permit Details start date", () => {
  it("should have disabled date options before today", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={30}
          commodities={[]}
        />
      </TestFormWrapper>
    );

    // Act
    const startDateSelect = await screen.findByTestId("CalendarIcon");
    await user.click(startDateSelect);

    // Assert
    const dateOptions = await screen.findAllByRole("gridcell");
    const thisMonthBeforeTodayIndices = dateOptions
      .map((option, i) => {
        const isBeforeToday = 
          option.textContent && Number(option.textContent) >= 1 && Number(option.textContent) < day;
        return isBeforeToday ? i : -1;
      })
      .filter(i => i >= 0);

    const beforeTodayDisabledIndices = thisMonthBeforeTodayIndices
      .filter(i => {
        return dateOptions[i].hasAttribute("disabled");
      });
    
    expect(await screen.findByTitle(/Previous month/i)).toBeDisabled();
    expect(beforeTodayDisabledIndices.length).toBe(day - 1);
  });

  it("should have disabled date options after 14 days from today", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={30}
          commodities={[]}
        />
      </TestFormWrapper>
    );

    // Act
    const startDateSelect = await screen.findByTestId("CalendarIcon");
    await user.click(startDateSelect);
    const nextMonthButton = await screen.findByTitle(/Next month/i);
    
    if (maxFutureMonth > thisMonth) {
      await user.click(nextMonthButton);

      await waitFor(async () => {
        // There's a period of time where all cells for both last month and this month are shown,
        // so we need to wait for last month cells to disappear
        const allCells = await screen.findAllByRole("gridcell");
        const dateCells = allCells.filter(
          cell => cell.textContent && Number(cell.textContent) > 0 && Number(cell.textContent) <= 31
        );
        expect(dateCells.length).toBeLessThanOrEqual(31);
      });
    }

    // Assert
    const dateOptions = await screen.findAllByRole("gridcell");
    const afterMaxFutureDayIndices = dateOptions
      .map((option, i) => {
        const isAfterMaxFutureDay = 
          option.textContent && Number(option.textContent) > maxFutureDay && Number(option.textContent) <= daysInFutureMonth;
        return isAfterMaxFutureDay ? i : -1;
      })
      .filter(i => i >= 0);
    
    const afterMaxFutureDayDisabledIndices = afterMaxFutureDayIndices
      .filter(i => {
        return dateOptions[i].hasAttribute("disabled");
      });
    expect(afterMaxFutureDayDisabledIndices.length).toBe(daysInFutureMonth - maxFutureDay);
  });

  it("should accept start dates with 14 days from today", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={30}
          commodities={[]}
        />
      </TestFormWrapper>
    );

    // Act
    const startDateSelect = await screen.findByTestId("CalendarIcon");
    await user.click(startDateSelect);
    const nextMonthButton = await screen.findByTitle(/Next month/i);
    
    // Assert
    if (maxFutureMonth > thisMonth) {
      // First find this month's active days
      const dateOptions = await screen.findAllByRole("gridcell");
      const indicesBetweenTodayToEndMonth = dateOptions
        .map((option, i) => {
          const isBetween = 
            option.textContent && Number(option.textContent) >= day && Number(option.textContent) <= daysInCurrMonth;
          return isBetween ? i : -1;
        })
        .filter(i => i >= 0);
      
      const activeIndices = indicesBetweenTodayToEndMonth
        .filter(i => {
          return !dateOptions[i].hasAttribute("disabled");
        });
      expect(activeIndices.length).toBe(daysInCurrMonth - day + 1);

      // Next, check active dates for next month
      await user.click(nextMonthButton);
      await waitFor(async () => {
        // There's a period of time where all cells for both last month and this month are shown,
        // so we need to wait for last month cells to disappear
        const allCells = await screen.findAllByRole("gridcell");
        const dateCells = allCells.filter(
          cell => cell.textContent && Number(cell.textContent) > 0 && Number(cell.textContent) <= 31
        );
        expect(dateCells.length).toBeLessThanOrEqual(31);
      });

      const nextMonthDateOptions = await screen.findAllByRole("gridcell");
      const indicesBetweenStartNextMonthToMaxFutureDay = nextMonthDateOptions
        .map((option, i) => {
          const isBetween = 
            option.textContent && Number(option.textContent) >= 1 && Number(option.textContent) <= maxFutureDay;
          return isBetween ? i : -1;
        })
        .filter(i => i >= 0);
      
      const activeIndicesNextMonth = indicesBetweenStartNextMonthToMaxFutureDay
        .filter(i => {
          return !nextMonthDateOptions[i].hasAttribute("disabled");
        });
      expect(activeIndicesNextMonth.length).toBe(maxFutureDay);
    } else {
      const dateOptions = await screen.findAllByRole("gridcell");
      const indicesBetweenTodayAndMaxFutureDay = dateOptions
        .map((option, i) => {
          const isBetween = 
            option.textContent && Number(option.textContent) >= day && Number(option.textContent) <= maxFutureDay;
          return isBetween ? i : -1;
        })
        .filter(i => i >= 0);
      
      const activeIndices = indicesBetweenTodayAndMaxFutureDay
        .filter(i => {
          return !dateOptions[i].hasAttribute("disabled");
        });
      expect(activeIndices.length).toBe(15); // today and next 14 days
    }
  });

  it("should display error message for invalid past start dates", async () => {
    // Arrange and Act
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={dayjs(currentDt).subtract(1, "day")}
          defaultDuration={30}
          commodities={[]}
        />
      </TestFormWrapper>
    );

    // Assert
    expect(await screen.findByText(/^Start date cannot be in the past/i)).toBeVisible();
  });

  it("should display error message for invalid future start dates (more than 14 days from today)", async () => {
    // Arrange and Act
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={dayjs(currentDt).add(15, "day")}
          defaultDuration={30}
          commodities={[]}
        />
      </TestFormWrapper>
    );

    // Assert
    expect(await screen.findByText(/^Start date must be within 14 days/i)).toBeVisible();
  });

  it("should display correct expiry date after selecting start date", async () => {
    // Arrange
    const user = userEvent.setup();
    const duration = 30;
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={duration}
          commodities={[]}
        />
      </TestFormWrapper>
    );

    // Act
    const startDateSelect = await screen.findByTestId("CalendarIcon");
    await user.click(startDateSelect);
    const tomorrowOption = await screen.findByText(String(tomorrowDay));
    await user.click(tomorrowOption);

    // Assert
    const expectedExpiry = dayjs(tomorrow).add(duration - 1, "day").format(DATE_FORMATS.SHORT);
    expect(await screen.findByText(expectedExpiry)).toBeVisible();
  });
});

describe("Permit Details commodities", () => {
  it("should display commodities info box", async () => {
    // Arrange and Act
    const duration = 30;
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={duration}
          commodities={commodities}
        />
      </TestFormWrapper>
    );

    // Assert
    expect(await screen.findByText(/^The applicant is responsible for/)).toBeVisible();
  });

  it("should properly display commodities", async () => {
    // Arrange and Act
    const duration = 30;
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={duration}
          commodities={commodities}
        />
      </TestFormWrapper>
    );

    const requiredCommodityIndices = 
      commodities.map((commodity, i) => 
        commodity.condition === "CVSE-1000" || commodity.condition === "CVSE-1070" ? i : -1
      ).filter(i => i >= 0);
    
    // Assert - All commodities are present
    await Promise.all(commodities.map(async (commodity) => await screen.findByText(commodity.description)));
    await Promise.all(commodities.map(async (commodity) => await screen.findByText(commodity.condition)));

    // Assert - Required commodities are checked and disabled
    const requiredCheckboxes = await Promise.all(
      commodities.filter((_, i) => requiredCommodityIndices.includes(i))
        .map(async (commodity) => await screen.findByLabelText(commodity.description))
    );
    const nonRequiredCheckboxes = await Promise.all(
      commodities.filter((_, i) => !requiredCommodityIndices.includes(i))
        .map(async (commodity) => await screen.findByLabelText(commodity.description))
    );
    requiredCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
    });
    nonRequiredCheckboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBeDisabled();
    });
  });

  it("should be able to select non-required commodities", async () => {
    // Arrange
    const user = userEvent.setup();
    const duration = 30;
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={duration}
          commodities={commodities}
        />
      </TestFormWrapper>
    );

    const requiredCommodityIndices = 
      commodities.map((commodity, i) => 
        commodity.condition === "CVSE-1000" || commodity.condition === "CVSE-1070" ? i : -1
      ).filter(i => i >= 0);
    
    const nonRequiredCheckboxes = await Promise.all(
      commodities.filter((_, i) => !requiredCommodityIndices.includes(i))
        .map(async (commodity) => await screen.findByLabelText(commodity.description))
    );

    // Act
    await Promise.all(nonRequiredCheckboxes.map(async (checkbox) => {
      await user.click(checkbox);
    }));

    // Assert
    nonRequiredCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  });

  it("should not be able to deselect required commodities", async () => {
    // Arrange
    const user = userEvent.setup({
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });
    const duration = 30;
    render(
      <TestFormWrapper>
        <PermitDetails
          feature="testfeature"
          defaultStartDate={currentDt}
          defaultDuration={duration}
          commodities={commodities}
        />
      </TestFormWrapper>
    );

    const requiredCommodityIndices = 
      commodities.map((commodity, i) => 
        commodity.condition === "CVSE-1000" || commodity.condition === "CVSE-1070" ? i : -1
      ).filter(i => i >= 0);
    
    const requiredCheckboxes = await Promise.all(
      commodities.filter((_, i) => requiredCommodityIndices.includes(i))
        .map(async (commodity) => await screen.findByLabelText(commodity.description))
    );

    // Act
    await Promise.all(requiredCheckboxes.map(async (checkbox) => {
      await user.click(checkbox);
    }));

    // Assert
    requiredCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  });
});
