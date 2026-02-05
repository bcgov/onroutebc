import {
  defaultCompanyInfo,
  renderTestComponent,
} from "./helpers/CompanyBanner/prepare";

import {
  companyClientLabel,
  companyClientNumber,
  companyName,
  companyNameLabel,
} from "./helpers/CompanyBanner/access";

describe("CompanyBanner display", () => {
  it("should render properly", async () => {
    // Arrange and Act
    renderTestComponent();

    // Assert
    expect(await companyNameLabel()).toHaveTextContent("CLIENT NAME");
    expect(await companyName()).toHaveTextContent("");
    expect(await companyClientLabel()).toHaveTextContent(
      "onRouteBC CLIENT NUMBER",
    );
    expect(await companyClientNumber()).toHaveTextContent("");
  });

  it("should properly display company profile info", async () => {
    // Arrange and Act
    renderTestComponent(defaultCompanyInfo);

    // Assert
    const { legalName, clientNumber } = defaultCompanyInfo;
    expect(await companyNameLabel()).toHaveTextContent("CLIENT NAME");
    expect(await companyName()).toHaveTextContent(legalName);
    expect(await companyClientLabel()).toHaveTextContent(
      "onRouteBC CLIENT NUMBER",
    );
    expect(await companyClientNumber()).toHaveTextContent(clientNumber);
  });
});
