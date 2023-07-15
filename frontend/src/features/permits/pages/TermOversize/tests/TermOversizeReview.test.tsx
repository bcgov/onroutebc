import { Dayjs } from "dayjs";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../../../common/helpers/formatDate";
import { 
  applicationCreatedDate,
  applicationHeaderTitle,
  applicationNumber,
  applicationUpdatedDate,
  companyClientLabel,
  companyClientNumber,
  companyInfoHeaderDescription, 
  companyInfoHeaderTitle, 
  companyMailAddrCityPostal, 
  companyMailAddrCountry, 
  companyMailAddrHeaderTitle, 
  companyMailAddrLine1, 
  companyMailAddrProvince, 
  companyName, 
  companyNameLabel, 
  contactInfoEmail, 
  contactInfoFax, 
  contactInfoHeaderTitle, 
  contactInfoName, 
  contactInfoPhone1, 
  contactInfoPhone2, 
  reviewConfirmWarning,
} from "./helpers/TermOversizeReview/access";
import { 
  closeMockServer,
  companyInfo,
  companyInfoDescription, 
  companyInfoTitle, 
  companyMailAddrTitle, 
  contactInfoTitle, 
  defaultApplicationData, 
  listenToMockServer, 
  renderTestComponent,
  resetMockServer,
} from "./helpers/TermOversizeReview/prepare";
import { formatCountry, formatProvince } from "../../../../../common/helpers/formatCountryProvince";

global.scrollTo = vi.fn();

beforeAll(() => {
  listenToMockServer();
});

beforeEach(() => {
  resetMockServer();
});

afterAll(() => {
  closeMockServer();
});

describe("Review and Confirm Application Details", () => {
  describe("Display Information from Application Details", () => {
    it("should display review and confirm warning message", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      expect(await reviewConfirmWarning()).toBeVisible();
    });

    it("should display proper application details in header", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const { applicationNumber: applicationNo, createdDateTime, updatedDateTime } = defaultApplicationData;
      expect(await applicationHeaderTitle()).toHaveTextContent("Oversize: Term");
      expect(await applicationNumber()).toHaveTextContent(applicationNo as string);
      expect(await applicationCreatedDate()).toHaveTextContent(dayjsToLocalStr(createdDateTime as Dayjs, DATE_FORMATS.LONG));
      expect(await applicationUpdatedDate()).toHaveTextContent(dayjsToLocalStr(updatedDateTime as Dayjs, DATE_FORMATS.LONG));
    });

    it("should display proper company info in company banner", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const { legalName, clientNumber } = companyInfo;
      expect(await companyNameLabel()).toHaveTextContent("COMPANY NAME");
      expect(await companyName()).toHaveTextContent(legalName);
      expect(await companyClientLabel()).toHaveTextContent("onRouteBC CLIENT NUMBER");
      expect(await companyClientNumber()).toHaveTextContent(clientNumber);
    });

    it("should display company information message", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      expect(await companyInfoHeaderTitle()).toHaveTextContent(companyInfoTitle);
      expect(await companyInfoHeaderDescription()).toHaveTextContent(companyInfoDescription);
    });

    it("should display proper company mailing address info", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const { addressLine1, city, countryCode, postalCode, provinceCode } = companyInfo.mailingAddress;
      const country = formatCountry(countryCode);
      const province = formatProvince(countryCode, provinceCode);
      expect(await companyMailAddrHeaderTitle()).toHaveTextContent(companyMailAddrTitle);
      expect(await companyMailAddrLine1()).toHaveTextContent(addressLine1);
      expect(await companyMailAddrCountry()).toHaveTextContent(country);
      expect(await companyMailAddrProvince()).toHaveTextContent(province);
      expect(await companyMailAddrCityPostal()).toHaveTextContent(`${city} ${postalCode}`);
    });

    it("should display proper full contact info in the permit", async () => {
      // Arrange and Act
      const fullContactInfo = {
        ...defaultApplicationData.permitData.contactDetails,
      };
      renderTestComponent(defaultApplicationData);

      // Assert
      expect(await contactInfoHeaderTitle()).toHaveTextContent(contactInfoTitle);
      expect(await contactInfoName()).toHaveTextContent(`${fullContactInfo.firstName} ${fullContactInfo.lastName}`);
      expect(await contactInfoPhone1()).toHaveTextContent(`${fullContactInfo.phone1} Ext: ${fullContactInfo.phone1Extension}`);
      expect(await contactInfoPhone2()).toHaveTextContent(`${fullContactInfo.phone2} Ext: ${fullContactInfo.phone2Extension}`);
      expect(await contactInfoEmail()).toHaveTextContent(`${fullContactInfo.email}`);
      expect(await contactInfoFax()).toHaveTextContent(`${fullContactInfo.fax}`);
    });

    it("should display proper partial contact info in the permit", async () => {
      // Arrange and Act
      const partialContactInfo = {
        firstName: defaultApplicationData.permitData.contactDetails?.firstName as string,
        lastName: defaultApplicationData.permitData.contactDetails?.lastName as string,
        email: defaultApplicationData.permitData.contactDetails?.email as string,
        phone1: defaultApplicationData.permitData.contactDetails?.phone1 as string,
        phone1Extension: undefined,
        phone2: undefined,
        phone2Extension: undefined,
        fax: undefined,
      };
      const applicationData = {
        ...defaultApplicationData,
        permitData: {
          ...defaultApplicationData.permitData,
          contactDetails: {
            ...partialContactInfo,
          }
        }
      };
      renderTestComponent(applicationData);

      // Assert
      expect(await contactInfoHeaderTitle()).toHaveTextContent(contactInfoTitle);
      expect(await contactInfoName()).toHaveTextContent(`${partialContactInfo.firstName} ${partialContactInfo.lastName}`);
      expect(await contactInfoPhone1()).toHaveTextContent(`${partialContactInfo.phone1}`);
      expect(async () => await contactInfoPhone2()).rejects.toThrow();
      expect(await contactInfoEmail()).toHaveTextContent(`${partialContactInfo.email}`);
      expect(async () => await contactInfoFax()).rejects.toThrow();
    });

    it("should display proper permit details", async () => {
      // Arrange and Act

      // Assert
    });

    it("should display selected commodities with links", async () => {
      // Arrange and Act

      // Assert
    });

    it("should display proper vehicle details", async () => {
      // Arrange and Act

      // Assert
    });

    it("should display indication message if vehicle was saved to inventory", async () => {
      // Arrange and Act

      // Assert
    });

    it("should not display indication message if vehicle was not saved to inventory", async () => {
      // Arrange and Act

      // Assert
    });

    it("should display proper fee summary", async () => {
      // Arrange and Act

      // Assert
    });
  });

  describe("Attestation", () => {
    it("should display attestation checkboxes", async () => {
      // Arrange and Act

      // Assert
    });

    it("should be able to continue when attestation checkboxes are checked", async () => {
      // Arrange and Act

      // Assert
    });

    it("should display error message when attestation checkboxes are not checked", async () => {
      // Arrange and Act

      // Assert
    });
  });
});