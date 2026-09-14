import { screen } from "@testing-library/react";
import {
  emptySuccessfulCalculation,
  legalInteraxleSpacingFailure,
} from "./aswFixtures";
import { renderASW } from "./renderASW";

/**
 * The purpose of this file is testing that the results render correctly in ASW table.
 * With the fixtures, we can easily setup failures or inputs for any situation.
 * In this case, we're testing that highlighting works.
 *
 * Importantly, we aren't actually testing the Policy Engine here, and if the PE changes
 * in the future this test will still pass as it is forcing a failure and making sure
 * that forced failure is properly rendered.
 */
describe("ASW policy result → UI contract", () => {
  it("highlights only the affected spacing for a legal interaxle spacing failure", async () => {
    // Spacing occupies its own row before axle 2: a common off-by-one trap.
    // Inject the result so this tests field association, not the PE spacing rule.
    const failure = legalInteraxleSpacingFailure({ axleUnit: 2 });
    const { user, asw } = renderASW({
      calculationResult: {
        ...emptySuccessfulCalculation(),
        results: [failure],
      },
    });

    await user.click(asw.calculate());

    expect(await screen.findByText(failure.message)).toBeVisible();
    const affectedField = asw.spacingBeforeAxle(2).closest(".table__input");
    expect(affectedField).toHaveClass("table__input--fail");
    // Exact membership catches both a missing highlight and collateral highlights
    // on weights, spreads, wheels, dropdowns, or the other axle row.
    expect(asw.highlightedFields()).toEqual([affectedField]);
  });
});
