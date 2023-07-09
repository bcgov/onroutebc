import { screen } from "@testing-library/react";
import { ApplicationDetails } from "../ApplicationDetails";
import { DATE_FORMATS, dayjsToLocalStr, utcToLocalDayjs } from "../../../../../common/helpers/formatDate";
import { renderWithClient } from "../../../../../common/helpers/testHelper";

const createdAt = utcToLocalDayjs("2023-06-14T09:00:00.000Z");
const updatedAt = utcToLocalDayjs("2023-06-15T13:00:00.000Z");

beforeEach(async () => {
  vi.resetModules();

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

const assertProperCompanyInfo = () => {
  // Assert company info still displays properly
  expect(screen.getByText("Company Information")).toBeInTheDocument();
  expect(
    screen.getByText(
      "If the Company Mailing Address is incorrect, please contact your onRouteBC Administrator."
    )
  ).toBeInTheDocument();
  expect(screen.getByText("My Company LLC")).toBeInTheDocument();
  expect(screen.getByText("B3-000001-700")).toBeInTheDocument();
  expect(screen.getByText(/^Company Mailing Address$/i)).toBeInTheDocument();
  expect(screen.getByText("123-4567 My Street")).toBeInTheDocument();
  expect(screen.getByText("Canada")).toBeInTheDocument();
  expect(screen.getByText("British Columbia")).toBeInTheDocument();
  expect(screen.getByText("Richmond V1C 2B3")).toBeInTheDocument();
};

describe("Application Details Display", () => {
  it("properly displays with empty application values", () => {
    // Arrange and Act
    renderWithClient(<ApplicationDetails/>);

    // Assert empty application values
    expect(screen.queryByText("Oversize: Term")).toBeNull();
    expect(screen.queryByText(/Application #/i)).toBeNull();
    expect(screen.queryByText(/Date Created/i)).toBeNull();
    expect(screen.queryByText(/Last Updated/i)).toBeNull();

    assertProperCompanyInfo();
  });

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

    // Assert application values display properly
    expect(screen.getByText("Oversize: Term")).toBeInTheDocument();
    expect(screen.getByTestId("application-number")).toHaveTextContent("ABC-123456");
    expect(screen.getByTestId("application-created-date")).toHaveTextContent(dayjsToLocalStr(createdAt, DATE_FORMATS.LONG));
    expect(screen.getByTestId("application-updated-date")).toHaveTextContent(dayjsToLocalStr(updatedAt, DATE_FORMATS.LONG));

    assertProperCompanyInfo();
  });
});
