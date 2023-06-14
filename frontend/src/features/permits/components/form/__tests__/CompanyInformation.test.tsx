import { render, screen } from "@testing-library/react";
import { CompanyInformation } from "../CompanyInformation";

describe("CompanyInformation display", () => {
  it("should render properly", () => {
    // Arrange and Act
    render(
      <CompanyInformation />
    );

    // Assert
    expect(screen.getByText("Company Information")).toBeInTheDocument();
    expect(
      screen.getByText(
        "If the Company Mailing Address is incorrect, please contact your onRouteBC Administrator."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/^Company Mailing Address$/i)).toBeNull();
  });

  it("should display company information properly", () => {
    // Arrange and Act
    render(
      <CompanyInformation
        companyInfo={{
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
        }}
      />
    );

    // Assert
    expect(screen.getByText(/^Company Mailing Address$/i)).toBeInTheDocument();
    expect(screen.getByText("123-4567 My Street")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
    expect(screen.getByText("British Columbia")).toBeInTheDocument();
    expect(screen.getByText("Richmond V1C 2B3")).toBeInTheDocument();
  });
});
