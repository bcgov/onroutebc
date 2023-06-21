import { FormProvider, useForm } from "react-hook-form";
import { PermitDetails } from "../PermitDetails";
import { DATE_FORMATS, now } from "../../../../../../common/helpers/formatDate";
import { render, screen } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import dayjs from "dayjs";
import { TROS_COMMODITIES } from "../../../../constants/termOversizeConstants";

const currentDt = now();
const tomorrow = dayjs(currentDt).add(1, "day");
const day = currentDt.date();
const tomorrowDay = tomorrow.date();

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
    const todayIndex = dateOptions.findIndex(option => option.textContent === String(day));
    if (todayIndex > 0 && day > 1) {
      expect(dateOptions[todayIndex - 1]).toBeDisabled();
    }
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
