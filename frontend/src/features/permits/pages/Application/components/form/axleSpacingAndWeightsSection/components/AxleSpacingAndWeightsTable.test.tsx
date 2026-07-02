import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { PERMIT_TYPES } from "../../../../../../types/PermitType";
import { AxleConfiguration, AxleUnit } from "../../../../../../types/AxleUnit";
import { POLICY_CHECK_ID_TYPES } from "../../../../../../types/AxleCalculationResult";
import { AxleSpacingAndWeightsTable } from "./AxleSpacingAndWeightsTable";

const loadEqualizationMessage =
  "Axle Unit 2 and Axle Unit 3 must be load equalized within 1000 kg.";
const singleSteerWeightMessage =
  "Single steer axle must be a minimum of 27% of tridem drive axle weight";
const tandemSteerWeightMessage =
  "Tandem steer axle must be a minimum of 40% of drive axle weight";
const pickerTruckTractorWeightMessage =
  "Axle Unit 1 must carry a minimum 50% of Axle Unit 2 axle unit weight.";

const powerUnitAxleConfiguration: AxleUnit[] = [
  {
    numberOfAxles: 1,
    axleUnitWeight: 6700,
    numberOfTires: 2,
    tireSize: 355,
  },
  {
    interaxleSpacing: 3.5,
  },
  {
    numberOfAxles: 2,
    axleSpread: 1.6,
    axleUnitWeight: 12000,
    numberOfTires: 4,
    tireSize: 330,
  },
];

const jeepAxleConfiguration: AxleUnit[] = [
  {
    interaxleSpacing: 3,
  },
  {
    numberOfAxles: 2,
    axleSpread: 1.6,
    axleUnitWeight: 10999,
    numberOfTires: 4,
    tireSize: 330,
  },
];

const combinedAxleConfiguration: AxleConfiguration[] = [
  {
    numberOfAxles: 1,
    axleUnitWeight: 6700,
    numberOfTires: 2,
    tireSize: 355,
  },
  {
    numberOfAxles: 2,
    axleSpread: 1.6,
    interaxleSpacing: 3.5,
    axleUnitWeight: 12000,
    numberOfTires: 4,
    tireSize: 330,
  },
  {
    numberOfAxles: 2,
    axleSpread: 1.6,
    interaxleSpacing: 3,
    axleUnitWeight: 10999,
    numberOfTires: 4,
    tireSize: 330,
  },
];

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("AxleSpacingAndWeightsTable", () => {
  it("displays and highlights validate-provided axle calculation failures", async () => {
    render(
      <AxleSpacingAndWeightsTable
        permitType={PERMIT_TYPES.STOW}
        powerUnitSubtypeNamesMap={new Map([["TRKTRAC", "Truck Tractor"]])}
        vehicleFormData={{
          vehicleId: "101",
          vin: "654321",
          plate: "D654321",
          make: "Custom",
          year: 2010,
          countryCode: "CA",
          provinceCode: "BC",
          vehicleType: "powerUnit",
          vehicleSubType: "TRKTRAC",
          licensedGVW: 40000,
        }}
        trailerSubtypeNamesMap={new Map([["JEEPSRG", "Jeep"]])}
        vehicleConfiguration={{
          axleConfiguration: powerUnitAxleConfiguration,
          trailers: [
            {
              vehicleSubType: "JEEPSRG",
              axleConfiguration: jeepAxleConfiguration,
            },
          ],
        }}
        axleCalculationResults={{
          results: [
            {
              id: POLICY_CHECK_ID_TYPES.DRIVE_JEEP_LOAD_EQUALIZATION,
              result: "fail",
              message: loadEqualizationMessage,
              startAxleUnit: 2,
              endAxleUnit: 3,
            },
          ],
          totalOverload: 0,
        }}
        tireSizeOptions={[
          { name: "330", size: 330 },
          { name: "355", size: 355 },
        ]}
        runAxleCalculation={vi.fn()}
        combineAxleConfigurations={() => combinedAxleConfiguration}
        calculateGCVW={() => 29699}
        onUpdatePowerUnitAxleConfiguration={vi.fn()}
        onUpdateTrailerAxleConfiguration={vi.fn()}
      />,
    );

    expect(await screen.findByText(loadEqualizationMessage)).toHaveClass(
      "results__text--fail",
    );
    expect(
      screen.queryByText("This permit type is not required."),
    ).not.toBeInTheDocument();
    expect(
      screen.getByDisplayValue("6700").closest(".table__input"),
    ).not.toHaveClass("table__input--fail");
    expect(
      screen.getByDisplayValue("12000").closest(".table__input"),
    ).toHaveClass("table__input--fail");
    expect(
      screen.getByDisplayValue("10999").closest(".table__input"),
    ).toHaveClass("table__input--fail");
  });

  it("displays and highlights a drive and jeep load equalization failure", async () => {
    const user = userEvent.setup();
    const runAxleCalculation = vi.fn().mockReturnValue({
      results: [
        {
          id: POLICY_CHECK_ID_TYPES.DRIVE_JEEP_LOAD_EQUALIZATION,
          result: "fail",
          message: loadEqualizationMessage,
          startAxleUnit: 2,
          endAxleUnit: 3,
        },
      ],
      totalOverload: 0,
    });

    render(
      <AxleSpacingAndWeightsTable
        permitType={PERMIT_TYPES.STOW}
        powerUnitSubtypeNamesMap={new Map([["TRKTRAC", "Truck Tractor"]])}
        vehicleFormData={{
          vehicleId: "101",
          vin: "654321",
          plate: "D654321",
          make: "Custom",
          year: 2010,
          countryCode: "CA",
          provinceCode: "BC",
          vehicleType: "powerUnit",
          vehicleSubType: "TRKTRAC",
          licensedGVW: 40000,
        }}
        trailerSubtypeNamesMap={new Map([["JEEPSRG", "Jeep"]])}
        vehicleConfiguration={{
          axleConfiguration: powerUnitAxleConfiguration,
          trailers: [
            {
              vehicleSubType: "JEEPSRG",
              axleConfiguration: jeepAxleConfiguration,
            },
          ],
        }}
        tireSizeOptions={[
          { name: "330", size: 330 },
          { name: "355", size: 355 },
        ]}
        runAxleCalculation={runAxleCalculation}
        combineAxleConfigurations={() => combinedAxleConfiguration}
        calculateGCVW={() => 29699}
        onUpdatePowerUnitAxleConfiguration={vi.fn()}
        onUpdateTrailerAxleConfiguration={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Calculate" }));

    expect(await screen.findByText(loadEqualizationMessage)).toHaveClass(
      "results__text--fail",
    );
    expect(
      screen.queryByText("This permit type is not required."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("You may require a different permit type"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByDisplayValue("6700").closest(".table__input"),
    ).not.toHaveClass("table__input--fail");
    expect(
      screen.getByDisplayValue("12000").closest(".table__input"),
    ).toHaveClass("table__input--fail");
    expect(
      screen.getByDisplayValue("10999").closest(".table__input"),
    ).toHaveClass("table__input--fail");
  });

  it("displays and highlights minimum steer axle weight failures", async () => {
    const user = userEvent.setup();
    const runAxleCalculation = vi.fn().mockReturnValue({
      results: [
        {
          id: POLICY_CHECK_ID_TYPES.MINIMUM_STEER_AXLE_WEIGHT,
          result: "fail",
          message: singleSteerWeightMessage,
          startAxleUnit: 1,
          endAxleUnit: 2,
        },
        {
          id: POLICY_CHECK_ID_TYPES.MINIMUM_TANDEM_STEER_AXLE_WEIGHT,
          result: "fail",
          message: tandemSteerWeightMessage,
          startAxleUnit: 1,
          endAxleUnit: 2,
        },
      ],
      totalOverload: 0,
    });

    render(
      <AxleSpacingAndWeightsTable
        permitType={PERMIT_TYPES.STOW}
        powerUnitSubtypeNamesMap={new Map([["TRKTRAC", "Truck Tractor"]])}
        vehicleFormData={{
          vehicleId: "101",
          vin: "654321",
          plate: "D654321",
          make: "Custom",
          year: 2010,
          countryCode: "CA",
          provinceCode: "BC",
          vehicleType: "powerUnit",
          vehicleSubType: "TRKTRAC",
          licensedGVW: 40000,
        }}
        trailerSubtypeNamesMap={new Map()}
        vehicleConfiguration={{
          axleConfiguration: powerUnitAxleConfiguration,
          trailers: [],
        }}
        tireSizeOptions={[
          { name: "330", size: 330 },
          { name: "355", size: 355 },
        ]}
        runAxleCalculation={runAxleCalculation}
        combineAxleConfigurations={() => combinedAxleConfiguration.slice(0, 2)}
        calculateGCVW={() => 18700}
        onUpdatePowerUnitAxleConfiguration={vi.fn()}
        onUpdateTrailerAxleConfiguration={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Calculate" }));

    expect(await screen.findByText(singleSteerWeightMessage)).toHaveClass(
      "results__text--fail",
    );
    expect(await screen.findByText(tandemSteerWeightMessage)).toHaveClass(
      "results__text--fail",
    );

    expect(
      screen.getByDisplayValue("6700").closest(".table__input"),
    ).toHaveClass("table__input--fail");
    expect(
      screen.getByDisplayValue("12000").closest(".table__input"),
    ).toHaveClass("table__input--fail");
  });

  it("displays and highlights picker truck tractor weight restriction failures", async () => {
    const user = userEvent.setup();
    const runAxleCalculation = vi.fn().mockReturnValue({
      results: [
        {
          id: POLICY_CHECK_ID_TYPES.PICKER_TRUCK_TRACTOR_WEIGHT_RESTRICTIONS,
          result: "fail",
          message: pickerTruckTractorWeightMessage,
          startAxleUnit: 1,
          endAxleUnit: 2,
        },
      ],
      totalOverload: 0,
    });

    render(
      <AxleSpacingAndWeightsTable
        permitType={PERMIT_TYPES.STOW}
        powerUnitSubtypeNamesMap={
          new Map([["PICKRTT", "Picker Truck Tractor"]])
        }
        vehicleFormData={{
          vehicleId: "101",
          vin: "654321",
          plate: "D654321",
          make: "Custom",
          year: 2010,
          countryCode: "CA",
          provinceCode: "BC",
          vehicleType: "powerUnit",
          vehicleSubType: "PICKRTT",
          licensedGVW: 40000,
        }}
        trailerSubtypeNamesMap={new Map()}
        vehicleConfiguration={{
          axleConfiguration: powerUnitAxleConfiguration,
          trailers: [],
        }}
        tireSizeOptions={[
          { name: "330", size: 330 },
          { name: "355", size: 355 },
        ]}
        runAxleCalculation={runAxleCalculation}
        combineAxleConfigurations={() => combinedAxleConfiguration.slice(0, 2)}
        calculateGCVW={() => 18700}
        onUpdatePowerUnitAxleConfiguration={vi.fn()}
        onUpdateTrailerAxleConfiguration={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Calculate" }));

    expect(
      await screen.findByText(pickerTruckTractorWeightMessage),
    ).toHaveClass("results__text--fail");
    expect(
      screen.getByDisplayValue("6700").closest(".table__input"),
    ).toHaveClass("table__input--fail");
    expect(
      screen.getByDisplayValue("12000").closest(".table__input"),
    ).toHaveClass("table__input--fail");
  });
});
