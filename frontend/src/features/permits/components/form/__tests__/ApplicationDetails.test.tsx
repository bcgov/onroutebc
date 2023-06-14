import { screen } from "@testing-library/react";
import { ApplicationDetails } from "../ApplicationDetails";
import { DATE_FORMATS, dayjsToLocalStr, utcToLocalDayjs } from "../../../../../common/helpers/formatDate";
import { renderWithClient } from "../../../../../common/helpers/testHelper";

const createdAt = utcToLocalDayjs("2023-06-14T09:00:00.000Z");
const updatedAt = utcToLocalDayjs("2023-06-15T13:00:00.000Z");

beforeEach(async () => {
  vi.resetModules();

  // Temp solution for mocking React Query to test the gettrailerTypes API call
  vi.mock("@tanstack/react-query", async () => {
    const actual: any = await vi.importActual("@tanstack/react-query");
    return {
      ...actual,
      useQuery: vi.fn().mockReturnValue({
        data: {
          companyId: 74,
          companyGUID: "AB1CD2EFAB34567CD89012E345FA678B",
          clientNumber: "B3-000001-700",
          legalName: "My Company LLC",
          mailingAddress: {
            addressLine1: "123-4567 My Street",
            city: "Richmond",
            provinceCode: "BC",
            countryCode: "CA",
            postalCode: "V1C 2B3",
          },
          email: "my.company@mycompany.co",
          phone: "604-123-4567",
          primaryContact: {
            firstName: "My",
            lastName: "Lastname",
            phone1: "604-123-4567",
            email: "my.company@mycompany.co",
            city: "Richmond",
            provinceCode: "BC",
            countryCode: "CA",
          },
        },
        isLoading: false,
        error: {},
      }),
    };
  });
});

describe("Application Details Display", () => {
  it("properly displays non-empty application details info", () => {
    // Arrange and act
    renderWithClient(
      <ApplicationDetails
        permitType="TROS"
        applicationNumber="ABC-123456"
        createdDateTime={createdAt}
        updatedDateTime={updatedAt}
      />
    );

    // Assert
    expect(screen.getByText("Term: Oversize")).toBeInTheDocument();
    expect(screen.getByText("Application # ABC-123456")).toBeInTheDocument();
    expect(screen.getByText(dayjsToLocalStr(createdAt, DATE_FORMATS.LONG))).toBeInTheDocument();
    expect(screen.getByText(dayjsToLocalStr(updatedAt, DATE_FORMATS.LONG))).toBeInTheDocument();
  });
});
