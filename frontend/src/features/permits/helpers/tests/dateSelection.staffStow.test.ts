import dayjs from "dayjs";

import {
  durationOptionsForPermitType,
  getMaxAllowedPermitFutureStartDate,
  getMinAllowedPermitPastStartDate,
} from "../dateSelection";
import { PERMIT_TYPES } from "../../types/PermitType";

describe("STOW permit date and duration selection by role", () => {
  const currentDate = dayjs("2026-08-17");

  it("allows staff to select any past date and up to 60 days in the future", () => {
    expect(
      getMinAllowedPermitPastStartDate(
        PERMIT_TYPES.STOW,
        currentDate,
        currentDate,
        true,
        false,
      ),
    ).toBeUndefined();
    expect(
      getMaxAllowedPermitFutureStartDate(
        PERMIT_TYPES.STOW,
        currentDate,
        true,
      ).isSame(currentDate.add(60, "day"), "day"),
    ).toBe(true);
  });

  it("keeps CV users at today through 14 days in the future", () => {
    expect(
      getMinAllowedPermitPastStartDate(
        PERMIT_TYPES.STOW,
        currentDate,
        currentDate,
        false,
        false,
      )?.isSame(currentDate, "day"),
    ).toBe(true);
    expect(
      getMaxAllowedPermitFutureStartDate(
        PERMIT_TYPES.STOW,
        currentDate,
        false,
      ).isSame(currentDate.add(14, "day"), "day"),
    ).toBe(true);
  });

  it("offers 1 to 30 days to staff without changing the CV 1 to 7 day list", () => {
    const staffOptions = durationOptionsForPermitType(PERMIT_TYPES.STOW, true);
    const cvOptions = durationOptionsForPermitType(PERMIT_TYPES.STOW, false);

    expect(staffOptions).toHaveLength(30);
    expect(staffOptions.at(0)).toEqual({ value: 1, label: "1 Day" });
    expect(staffOptions.at(-1)).toEqual({ value: 30, label: "30 Days" });
    expect(cvOptions).toHaveLength(7);
    expect(cvOptions.at(-1)).toEqual({ value: 7, label: "7 Days" });
  });
});
