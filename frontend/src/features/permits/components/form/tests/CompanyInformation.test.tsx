import { 
  companyInfoDescription, 
  companyInfoTitle, 
  companyMailAddrTitle, 
  country, 
  defaultCompanyInfo, 
  province, 
  renderTestComponent,
} from "./helpers/CompanyInformation/prepare";

import { 
  headerDescription, 
  headerTitle, 
  mailAddrCityPostal, 
  mailAddrCountry, 
  mailAddrLine1, 
  mailAddrProvince, 
  mailAddrTitle,
} from "./helpers/CompanyInformation/access";

describe("CompanyInformation display", () => {
  it("should render properly", async () => {
    // Arrange and Act
    renderTestComponent();

    // Assert
    expect(await headerTitle()).toHaveTextContent(companyInfoTitle);
    expect(await headerDescription()).toHaveTextContent(companyInfoDescription);
    expect(async () => await mailAddrTitle()).rejects.toThrow();
  });

  it("should display company information properly", async () => {
    // Arrange and Act
    renderTestComponent(defaultCompanyInfo);

    // Assert
    const {
      addressLine1,
      city,
      postalCode,
    } = defaultCompanyInfo.mailingAddress;
    expect(await mailAddrTitle()).toHaveTextContent(companyMailAddrTitle);
    expect(await mailAddrLine1()).toHaveTextContent(addressLine1);
    expect(await mailAddrCountry()).toHaveTextContent(country);
    expect(await mailAddrProvince()).toHaveTextContent(province);
    expect(await mailAddrCityPostal()).toHaveTextContent(`${city} ${postalCode}`);
  });
});
