import { screen } from "@testing-library/react";
import { renderASW } from "./renderASW";

/**
 * The purpose of this test is to make sure that the contract between the ASW and hte Policy Engine
 * remains stable. There are some kind of trickier behaviour, like the fact that the user selects
 * "3.25" but the PE expects "325." This is already working, but we want to have a test to make
 * sure it's not broken in the future.
 *
 * We do mock the entire PE runAxleCalc function here, just to make sure the inputs are good
 * and the contract is enforced. We aren't actually testing the policy engine here, as it's
 * tested internally.
 */

describe("ASW input → calculation callback contract", () => {
  it("passes numeric centimetres and unchanged weights to the calculation callback", async () => {
    const { user, runAxleCalculation, asw } = renderASW();

    await user.clear(asw.spacingBeforeAxle(2));
    await user.type(asw.spacingBeforeAxle(2), "3.25");
    await user.tab();
    await user.click(asw.calculate());

    expect(runAxleCalculation).toHaveBeenCalledOnce();

    // Test the data we pass into runAxleCalc, and make sure it matches contract we expect.
    // We can't just do this with typechecking, as 3.25 and 325 are both typeof "number".
    const axleConfiguration = runAxleCalculation.mock.calls[0][3];
    expect(axleConfiguration).toHaveLength(2);
    expect(axleConfiguration).toMatchObject([
      { numberOfAxles: 1, axleUnitWeight: 6700 },
      {
        numberOfAxles: 2,
        interaxleSpacing: 325, // make sure we have 325 here not 3.25!
        axleSpread: 160,
        axleUnitWeight: 12000,
      },
    ]);
  });

  // Clear the input, then make sure that we don't hit PE after.
  it("blocks calculation and shows validation when required input is cleared", async () => {
    const { user, runAxleCalculation, asw } = renderASW();

    const requiredFieldsMessage =
      "All fields in Axle Spacing and Weights are required to calculate results.";
    expect(screen.queryByText(requiredFieldsMessage)).not.toBeInTheDocument();

    await user.clear(asw.weight(2));
    await user.tab();
    await user.click(asw.calculate());

    expect(runAxleCalculation).not.toHaveBeenCalled();
    expect(screen.getByText(requiredFieldsMessage)).toBeVisible();
  });
});
