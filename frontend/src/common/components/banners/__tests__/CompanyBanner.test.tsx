import { render, screen } from "@testing-library/react";
import { CompanyBanner } from "../CompanyBanner";

describe("CompanyBanner display", () => {
  it("should render properly", () => {
    // Arrange and Act
    render(<CompanyBanner />);

    // Assert
    expect(screen.getByText("COMPANY NAME")).toBeInTheDocument();
    expect(screen.getByText("onRouteBC CLIENT NUMBER")).toBeInTheDocument();
  });

  it("should properly display company profile info", () => {
    // Arrange and Act
    render(
      <CompanyBanner
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
    expect(screen.getByText("My Company LLC")).toBeInTheDocument();
    expect(screen.getByText("B3-000001-700")).toBeInTheDocument();
  });
});