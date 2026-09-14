import { ComponentProps, useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AxleSpacingAndWeightsSection } from "../AxleSpacingAndWeightsSection";
import { PERMIT_TYPES } from "../../../../../../types/PermitType";
import { AxleCalculationResult } from "../../../../../../types/AxleCalculationResult";
import { emptySuccessfulCalculation, validTruckTractor } from "./aswFixtures";

type RunAxleCalculation = NonNullable<
  ComponentProps<typeof AxleSpacingAndWeightsSection>["runAxleCalculation"]
>;

/**
 * This is a pretty big testing function and sets up the foundation for future tests
 *
 * Basically, it returns the UI rendered itself, but also has a lot of helpers
 * for rendering and asserting in tests like showing highlighted fields, or
 * weight, or axle spacing. It also importantly returns the mocked runAxleCalculation,
 * which is the boundary with the PE, and let's us make sure we have a stable boundary
 * there.
 *
 * If we add some OCD tests in the future, this would be the function to add them.
 */
export const renderASW = ({
  calculationResult = emptySuccessfulCalculation(),
}: { calculationResult?: AxleCalculationResult } = {}) => {
  const fixture = validTruckTractor();
  // Record the section's callback payload and control its response. The real
  // useRunAxleCalculation adapter and PE invocation are outside this boundary.
  const runAxleCalculation = vi
    .fn<Parameters<RunAxleCalculation>, ReturnType<RunAxleCalculation>>()
    .mockReturnValue(calculationResult);

  const Harness = () => {
    const [vehicleConfiguration, setVehicleConfiguration] = useState(
      fixture.vehicleConfiguration,
    );
    return (
      <AxleSpacingAndWeightsSection
        permitType={PERMIT_TYPES.STOW}
        powerUnitSubtypeNamesMap={new Map([["TRKTRAC", "Truck Tractor"]])}
        trailerSubtypeNamesMap={new Map()}
        vehicleFormData={fixture.vehicleFormData}
        vehicleConfiguration={vehicleConfiguration}
        tireSizeOptions={[
          { name: "330", size: 330 },
          { name: "355", size: 355 },
        ]}
        runAxleCalculation={runAxleCalculation}
        // This fixture has no trailers: forward the actual edited axles, never canned data.
        combineAxleConfigurations={(powerUnitAxles) => powerUnitAxles}
        // Blur must update parent state so Calculate reads the user's edit.
        onUpdatePowerUnitAxleConfiguration={(axleConfiguration) =>
          setVehicleConfiguration((current) => ({
            ...current,
            axleConfiguration,
          }))
        }
        showASWRequiredFieldsBanner={false}
      />
    );
  };

  render(<Harness />);
  const table = screen.getByRole("table");
  const axleRow = (axle: number) => {
    const row = within(table)
      .getByText(`${axle}`, { selector: ".row__label-content span" })
      .closest("tr");
    if (!row) throw new Error(`Missing row for axle unit ${axle}`);
    return row;
  };
  // Locate controls by the table's visible headings; keep DOM layout knowledge here.
  const inputInColumn = (row: Element | null, heading: string) => {
    if (!(row instanceof HTMLElement))
      throw new Error(`Missing row for ${heading}`);
    const header = within(table).getByRole("columnheader", {
      name: heading,
    });
    const column = within(table).getAllByRole("columnheader").indexOf(header);
    return within(within(row).getAllByRole("cell")[column]).getByRole(
      "textbox",
    );
  };

  return {
    user: userEvent.setup(),
    runAxleCalculation,
    asw: {
      calculate: () => screen.getByRole("button", { name: "Calculate" }),
      // Spacing is displayed in the row immediately before the axle it belongs to.
      spacingBeforeAxle: (axle: number) =>
        inputInColumn(
          axleRow(axle).previousElementSibling,
          "Interaxle Spacing (m)",
        ),
      weight: (axle: number) =>
        inputInColumn(axleRow(axle), "Axle Unit Weight (kg)"),
      highlightedFields: () =>
        Array.from(table.querySelectorAll(".table__input--fail")),
    },
  };
};
