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
 *
 * Returned API:
 * - `user` is used for all mouse/keyboard events
 * - `runAxleCalculation` is the mocked policy engine object, it's how we enforce
 * the contract between PE and FE.
 * - `asw.calculate()` is just a helper to call the Calculate button
 * - `asw.spacingBeforeAxle(axle)` returns the spacing textbox immediately
 *   before the requested axle row (as axel spacing is in it's own row)
 * - `asw.weight(axle)` returns the weight textbox in the requested axle row.
 * - `asw.highlightedFields()` returns all current elements with the ASW failure
 *   class, which is useful for exact highlighted-field assertions.
 *
 * The `asw` accessors are functions rather than stored elements. They query the
 * rendered table when called, so a test can edit a value, blur it, and then
 * query the updated DOM after React has applied the state change.
 *
 * @example
 * const { user, asw, runAxleCalculation } = renderASW();
 *
 * await user.clear(asw.spacingBeforeAxle(2));
 * await user.type(asw.spacingBeforeAxle(2), "3.25");
 * await user.tab();
 * await user.click(asw.calculate());
 *
 * // `mock.calls[0][3]` is the fourth argument: serialized axle configuration.
 * const serializedAxles = runAxleCalculation.mock.calls[0][3];
 * expect(serializedAxles[1].interaxleSpacing).toBe(325);
 * 
 * 
 * // For the `mocks.calls[0][3]`, the first [0] is how many times you called runAxleCalc
 * // and the [3] is the axleConfiguration, from list below
 * runAxleCalculation(
 *   permitType,             // argument 0
 *   vehicleFormData,        // argument 1
 *   vehicleConfiguration,   // argument 2
 *   axleConfiguration,      // argument 3 < this one
 *   licensedGVW,            // argument 4
 * );
 */
export const renderASW = ({
  calculationResult = emptySuccessfulCalculation(),
}: { calculationResult?: AxleCalculationResult } = {}) => {
  const fixture = validTruckTractor();

  // Our mocked runAxleCalculation. We don't actually RUN any PE here, we just use this
  // to verify our 'contract' with the PE is solid.
  const runAxleCalculation = vi
    .fn<Parameters<RunAxleCalculation>, ReturnType<RunAxleCalculation>>()
    .mockReturnValue(calculationResult);

  /**
   * This harness is basically all we need to render the ASW, but we
   * have to have it stateful, as ASW is built to update parent state
   * 
   * It will likely grow in a few small ways as we add tests, for example,
   * tireSizeOptions, or trailer subtypes, but it gets the point across.
   * 
   * For simplicity, some values are hardcoded, but if added in future
   * we likely need to add all of them programatically similar to the
   * application, eg make sure we get all trailer types, power unit types.
   */
  const Harness = () => {
    const [vehicleConfiguration, setVehicleConfiguration] = useState(
      fixture.vehicleConfiguration,
    );
    return (
      <AxleSpacingAndWeightsSection
        permitType={PERMIT_TYPES.STOW}
        powerUnitSubtypeNamesMap={new Map([["TRKTRAC", "Truck Tractor"]])}
        trailerSubtypeNamesMap={new Map()} // No trailers for now! Maybe add in future. 
        vehicleFormData={fixture.vehicleFormData}
        vehicleConfiguration={vehicleConfiguration}
        tireSizeOptions={[
          { name: "330", size: 330 },
          { name: "355", size: 355 },
        ]}
        runAxleCalculation={runAxleCalculation}
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

  // Our dom selector helper, this is internal, but super helpful
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
