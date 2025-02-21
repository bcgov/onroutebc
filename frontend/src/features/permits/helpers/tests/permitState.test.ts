import dayjs from "dayjs";

import { getExpiryDate } from "../permitState";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../../common/helpers/formatDate";
import { BASE_DAYS_IN_YEAR } from "../../constants/constants";

describe("Permit States", () => {
  it("yields correct expiry date given start date and non-year duration", () => {
    // Arrange
    const startDate = dayjs("2023-09-01");
    const duration = 30;

    // Act
    const expiryDate = getExpiryDate(startDate, false, duration);
    const expiryDateStr = dayjsToLocalStr(expiryDate, DATE_FORMATS.DATEONLY);

    // Assert
    expect(expiryDateStr).toBe("2023-09-30"); // +30 (-1) days
  });

  it("yields correct expiry date (before leap year Feb-29) given start date and 1-year duration", () => {
    // Arrange
    const startDate = dayjs("2023-02-28");
    const duration = BASE_DAYS_IN_YEAR;

    // Act
    const expiryDate = getExpiryDate(startDate, false, duration);
    const expiryDateStr = dayjsToLocalStr(expiryDate, DATE_FORMATS.DATEONLY);

    // Assert
    expect(expiryDateStr).toBe("2024-02-27"); // +365 (-1) days
  });

  it("yields correct expiry date for leap year given start date and 1-year duration", () => {
    // Arrange
    const startDate = dayjs("2023-03-01");
    const duration = BASE_DAYS_IN_YEAR;

    // Act
    const expiryDate = getExpiryDate(startDate, false, duration);
    const expiryDateStr = dayjsToLocalStr(expiryDate, DATE_FORMATS.DATEONLY);

    // Assert
    expect(expiryDateStr).toBe("2024-02-29"); // +366 (-1) days
  });

  it("yields correct expiry date for quarterly permit with given start date", () => {
    // Arrange
    const startDate = dayjs("2023-03-01");

    // Act
    const expiryDate = getExpiryDate(startDate, true, 0);
    const expiryDateStr = dayjsToLocalStr(expiryDate, DATE_FORMATS.DATEONLY);

    // Assert
    expect(expiryDateStr).toBe("2023-04-30");
  });
});
