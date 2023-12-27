import { Dayjs } from "dayjs";
import { waitFor } from "@testing-library/react";

import { VehicleDetails } from "../../../types/application";
import { vehicleTypeDisplayText } from "../../../helpers/mappers";
import { VehicleTypesAsString } from "../../../../manageVehicles/types/managevehicles";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { calculateFeeByDuration } from "../../../helpers/feeSummary";
import { permitTypeDisplayText } from "../../../types/PermitType";
import {
  DATE_FORMATS,
  dayjsToLocalStr,
} from "../../../../../common/helpers/formatDate";

import {
  formatCountry,
  formatProvince,
} from "../../../../../common/helpers/formatCountryProvince";

import {
  applicationCreatedDate,
  applicationHeaderTitle,
  applicationNumber,
  applicationUpdatedDate,
  attestationCheckboxes,
  attestationErrorMsg,
  checkAttestations,
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
  feeSummaryPermitType,
  feeSummaryPrice,
  feeSummaryTotal,
  permitConditionCodes,
  permitConditionDescriptions,
  permitConditionLinks,
  permitConditions,
  permitDuration,
  permitExpiryDate,
  permitStartDate,
  proceedToPay,
  reviewConfirmWarning,
  vehicleCountry,
  vehicleMake,
  vehiclePlate,
  vehicleProvince,
  vehicleSavedMsg,
  vehicleSubtypeDisplay,
  vehicleTypeDisplay,
  vehicleUnitNumber,
  vehicleVIN,
  vehicleYear,
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
  vehicleDetails,
  vehicleSubtypes,
} from "./helpers/TermOversizeReview/prepare";

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.scrollTo = vi.fn();
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
      const {
        applicationNumber: applicationNo,
        createdDateTime,
        updatedDateTime,
        permitType,
      } = defaultApplicationData;
      expect(await applicationHeaderTitle()).toHaveTextContent(
        permitTypeDisplayText(permitType),
      );
      expect(await applicationNumber()).toHaveTextContent(
        applicationNo as string,
      );
      expect(await applicationCreatedDate()).toHaveTextContent(
        dayjsToLocalStr(createdDateTime as Dayjs, DATE_FORMATS.LONG),
      );
      expect(await applicationUpdatedDate()).toHaveTextContent(
        dayjsToLocalStr(updatedDateTime as Dayjs, DATE_FORMATS.LONG),
      );
    });

    it("should display proper company info in company banner", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const { legalName, clientNumber } = companyInfo;
      expect(await companyNameLabel()).toHaveTextContent("COMPANY NAME");
      expect(await companyName()).toHaveTextContent(legalName);
      expect(await companyClientLabel()).toHaveTextContent(
        "onRouteBC CLIENT NUMBER",
      );
      expect(await companyClientNumber()).toHaveTextContent(clientNumber);
    });

    it("should display company information message", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      expect(await companyInfoHeaderTitle()).toHaveTextContent(
        companyInfoTitle,
      );
      expect(await companyInfoHeaderDescription()).toHaveTextContent(
        companyInfoDescription,
      );
    });

    it("should display proper company mailing address info", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const { addressLine1, city, countryCode, postalCode, provinceCode } =
        companyInfo.mailingAddress;
      const country = formatCountry(countryCode);
      const province = formatProvince(countryCode, provinceCode);
      expect(await companyMailAddrHeaderTitle()).toHaveTextContent(
        companyMailAddrTitle,
      );
      expect(await companyMailAddrLine1()).toHaveTextContent(addressLine1);
      expect(await companyMailAddrCountry()).toHaveTextContent(country);
      expect(await companyMailAddrProvince()).toHaveTextContent(province);
      expect(await companyMailAddrCityPostal()).toHaveTextContent(
        `${city} ${postalCode}`,
      );
    });

    it("should display proper full contact info in the permit", async () => {
      // Arrange and Act
      const fullContactInfo = {
        ...defaultApplicationData.permitData.contactDetails,
      };
      renderTestComponent(defaultApplicationData);

      // Assert
      expect(await contactInfoHeaderTitle()).toHaveTextContent(
        contactInfoTitle,
      );
      expect(await contactInfoName()).toHaveTextContent(
        `${fullContactInfo.firstName} ${fullContactInfo.lastName}`,
      );
      expect(await contactInfoPhone1()).toHaveTextContent(
        `${fullContactInfo.phone1} Ext: ${fullContactInfo.phone1Extension}`,
      );
      expect(await contactInfoPhone2()).toHaveTextContent(
        `${fullContactInfo.phone2} Ext: ${fullContactInfo.phone2Extension}`,
      );
      expect(await contactInfoEmail()).toHaveTextContent(
        `${fullContactInfo.email}`,
      );
      expect(await contactInfoFax()).toHaveTextContent(
        `${fullContactInfo.fax}`,
      );
    });

    it("should display proper partial contact info in the permit", async () => {
      // Arrange and Act
      const partialContactInfo = {
        firstName: defaultApplicationData.permitData.contactDetails
          ?.firstName as string,
        lastName: defaultApplicationData.permitData.contactDetails
          ?.lastName as string,
        email: defaultApplicationData.permitData.contactDetails
          ?.email as string,
        phone1: defaultApplicationData.permitData.contactDetails
          ?.phone1 as string,
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
          },
        },
      };
      renderTestComponent(applicationData);

      // Assert
      expect(await contactInfoHeaderTitle()).toHaveTextContent(
        contactInfoTitle,
      );
      expect(await contactInfoName()).toHaveTextContent(
        `${partialContactInfo.firstName} ${partialContactInfo.lastName}`,
      );
      expect(await contactInfoPhone1()).toHaveTextContent(
        `${partialContactInfo.phone1}`,
      );
      expect(async () => await contactInfoPhone2()).rejects.toThrow();
      expect(await contactInfoEmail()).toHaveTextContent(
        `${partialContactInfo.email}`,
      );
      expect(async () => await contactInfoFax()).rejects.toThrow();
    });

    it("should display proper permit details", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const {
        startDate,
        expiryDate,
        permitDuration: duration,
      } = defaultApplicationData.permitData;

      const startDateStr = dayjsToLocalStr(
        startDate,
        DATE_FORMATS.DATEONLY_SLASH,
      );

      const expiryDateStr = dayjsToLocalStr(expiryDate, DATE_FORMATS.SHORT);

      expect(await permitStartDate()).toHaveTextContent(startDateStr);
      expect(await permitDuration()).toHaveTextContent(`${duration} Days`);
      expect(await permitExpiryDate()).toHaveTextContent(expiryDateStr);
    });

    it("should display selected commodities with links", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const commodities = defaultApplicationData.permitData.commodities;
      const descriptions = commodities.map((c) => c.description);
      const links = commodities.map((c) => c.conditionLink);
      const conditions = commodities.map((c) => c.condition);
      const commodityRows = await permitConditions();
      const commodityDescriptions = await permitConditionDescriptions();
      const commodityLinks = await permitConditionLinks();
      const commodityConditions = await permitConditionCodes();
      expect(commodityRows).toHaveLength(commodities.length);
      expect(commodityDescriptions).toHaveLength(descriptions.length);
      expect(commodityLinks).toHaveLength(links.length);
      expect(commodityConditions).toHaveLength(conditions.length);
      commodityDescriptions.forEach((desc) => {
        expect(descriptions).toContain(desc.textContent);
      });
      const descriptionText = commodityDescriptions.map((d) => d.textContent);
      descriptions.forEach((d) => {
        expect(descriptionText).toContain(d);
      });

      commodityLinks.forEach((link) => {
        expect(links).toContain(link.getAttribute("href"));
      });
      const linkHrefs = commodityLinks.map((l) => l.getAttribute("href"));
      links.forEach((l) => {
        expect(linkHrefs).toContain(l);
      });

      commodityConditions.forEach((cond) => {
        expect(conditions).toContain(cond.textContent);
      });
      const conditionCodes = commodityConditions.map((c) => c.textContent);
      conditions.forEach((c) => {
        expect(conditionCodes).toContain(c);
      });
    });

    it("should display proper vehicle details", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const {
        unitNumber,
        vin,
        plate,
        make,
        year,
        countryCode,
        provinceCode,
        vehicleType,
        vehicleSubType,
      } = defaultApplicationData.permitData.vehicleDetails as VehicleDetails;
      const unit = getDefaultRequiredVal("", unitNumber);
      const country = formatCountry(countryCode);
      const province = formatProvince(countryCode, provinceCode);
      const vehicleTypeStr = vehicleTypeDisplayText(
        vehicleType as VehicleTypesAsString,
      );
      const vehicleSubtypeStr = getDefaultRequiredVal(
        "",
        vehicleSubtypes.find((subtype) => subtype.typeCode === vehicleSubType)
          ?.type,
      );
      expect(await vehicleUnitNumber()).toHaveTextContent(unit);
      expect(await vehicleVIN()).toHaveTextContent(vin);
      expect(await vehiclePlate()).toHaveTextContent(plate);
      expect(await vehicleMake()).toHaveTextContent(make);
      expect(await vehicleYear()).toHaveTextContent(`${year}`);
      expect(await vehicleCountry()).toHaveTextContent(country);
      expect(await vehicleProvince()).toHaveTextContent(province);
      expect(await vehicleTypeDisplay()).toHaveTextContent(vehicleTypeStr);
      await waitFor(async () => {
        expect(await vehicleSubtypeDisplay()).toHaveTextContent(
          vehicleSubtypeStr,
        );
      });
    });

    it("should display indication message if vehicle was saved to inventory", async () => {
      // Arrange and Act
      const applicationData = {
        ...defaultApplicationData,
        permitData: {
          ...defaultApplicationData.permitData,
          vehicleDetails: {
            ...vehicleDetails,
            saveVehicle: true,
          },
        },
      };
      renderTestComponent(applicationData);

      // Assert
      expect(await vehicleSavedMsg()).toHaveTextContent(
        "This vehicle has been added/updated to your Vehicle Inventory.",
      );
    });

    it("should not display indication message if vehicle was not saved to inventory", async () => {
      // Arrange and Act
      const applicationData = {
        ...defaultApplicationData,
        permitData: {
          ...defaultApplicationData.permitData,
          vehicleDetails: {
            ...vehicleDetails,
            saveVehicle: false,
          },
        },
      };
      renderTestComponent(applicationData);

      // Assert
      expect(async () => await vehicleSavedMsg()).rejects.toThrow();
    });

    it("should display proper fee summary", async () => {
      // Arrange and Act
      const applicationData = {
        ...defaultApplicationData,
        permitData: {
          ...defaultApplicationData.permitData,
          feeSummary: `${calculateFeeByDuration(
            defaultApplicationData.permitData.permitDuration,
          )}`,
        },
      };
      renderTestComponent(applicationData);

      // Assert
      const {
        permitType,
        permitData: { feeSummary },
      } = applicationData;
      const permitTypeStr = permitTypeDisplayText(permitType);
      expect(await feeSummaryPermitType()).toHaveTextContent(permitTypeStr);
      expect(await feeSummaryPrice()).toHaveTextContent(`$${feeSummary}.00`);
      expect(await feeSummaryTotal()).toHaveTextContent(`$${feeSummary}.00`);
    });
  });

  describe("Attestation", () => {
    it("should display attestation checkboxes", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      expect(await attestationCheckboxes()).toHaveLength(3);
    });

    it("should display error message when attestation checkboxes are not checked", async () => {
      // Arrange
      const { user } = renderTestComponent(defaultApplicationData);

      // Act
      await checkAttestations(user, [0, 1]);
      await proceedToPay(user);

      // Assert
      expect(await attestationErrorMsg()).toHaveTextContent(
        "Checkbox selection is required",
      );
    });

    it("should not show error message when all attestation checkboxes are checked", async () => {
      const { user } = renderTestComponent(defaultApplicationData);

      // Act
      await checkAttestations(user, [0, 1, 2]);
      await proceedToPay(user);

      // Assert
      expect(async () => await attestationErrorMsg()).rejects.toThrow();
    });
  });
});
