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
    const startDateQ1 = dayjs("2023-03-01");
    const startDateQ2 = dayjs("2023-04-01");
    const startDateQ3 = dayjs("2023-07-01");
    const startDateQ4 = dayjs("2023-10-01");

    // Act
    const expiryDateQ1 = getExpiryDate(startDateQ1, true, 0);
    const expiryDateStrQ1 = dayjsToLocalStr(expiryDateQ1, DATE_FORMATS.DATEONLY);
    const expiryDateQ2 = getExpiryDate(startDateQ2, true, 0);
    const expiryDateStrQ2 = dayjsToLocalStr(expiryDateQ2, DATE_FORMATS.DATEONLY);
    const expiryDateQ3 = getExpiryDate(startDateQ3, true, 0);
    const expiryDateStrQ3 = dayjsToLocalStr(expiryDateQ3, DATE_FORMATS.DATEONLY);
    const expiryDateQ4 = getExpiryDate(startDateQ4, true, 0);
    const expiryDateStrQ4 = dayjsToLocalStr(expiryDateQ4, DATE_FORMATS.DATEONLY);

    // Assert
    expect(expiryDateStrQ1).toBe("2023-03-31");
    expect(expiryDateStrQ2).toBe("2023-06-30");
    expect(expiryDateStrQ3).toBe("2023-09-30");
    expect(expiryDateStrQ4).toBe("2023-12-31");
  });
});
