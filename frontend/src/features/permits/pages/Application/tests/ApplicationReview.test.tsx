import { screen } from "@testing-library/react";
import { Dayjs } from "dayjs";
import { waitFor } from "@testing-library/react";
import type { ValidationResult, ValidationResults } from "onroute-policy-engine";
import {
  PolicyCheckId,
  PolicyCheckResultType,
} from "onroute-policy-engine/enum";

const policyWarningMocks = vi.hoisted(() => ({
  hasPolicyIssues: false,
  policyWarnings: [] as ValidationResult[],
  axleCalculationResults: undefined as ValidationResults["axleCalculationResults"],
}));

vi.mock("../../../hooks/usePolicyWarnings", () => ({
  usePolicyWarnings: () => policyWarningMocks,
}));

vi.mock("../../../../policy/hooks/usePolicyEngine", () => ({
  usePolicyEngine: () => ({
    getCommodities: () => new Map(),
    getStandardTireSizes: () => [
      { name: "355", size: 355 },
      { name: "330", size: 330 },
    ],
    validate: vi.fn().mockResolvedValue({
      cost: [],
      information: [],
      requirements: [],
      violations: [],
      warnings: [],
    }),
  }),
}));

import { PermitVehicleDetails } from "../../../types/PermitVehicleDetails";
import { Application } from "../../../types/application";
import { vehicleTypeDisplayText } from "../../../../manageVehicles/types/Vehicle";
import { VehicleType } from "../../../../manageVehicles/types/Vehicle";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { getPermitTypeName, PERMIT_TYPES } from "../../../types/PermitType";
import { getCountryFullName } from "../../../../../common/helpers/countries/getCountryFullName";
import { getProvinceFullName } from "../../../../../common/helpers/countries/getProvinceFullName";
import {
  DATE_FORMATS,
  dayjsToLocalStr,
} from "../../../../../common/helpers/formatDate";

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
  companyInfoHeaderTitle,
  companyMailAddrCityPostal,
  companyMailAddrCountry,
  companyMailAddrHeaderTitle,
  companyMailAddrLine1,
  companyMailAddrProvince,
  companyName,
  companyNameLabel,
  contactInfoAdditionalEmail,
  contactInfoEmail,
  contactInfoHeaderTitle,
  contactInfoName,
  contactInfoPhone1,
  contactInfoPhone2,
  permitConditionCodes,
  permitConditionDescriptions,
  permitConditionLinks,
  permitConditions,
  permitDuration,
  permitExpiryDate,
  permitStartDate,
  proceedToAddToCart,
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
} from "./helpers/ApplicationReview/access";

import {
  closeMockServer,
  applicationSaveRequestCount,
  cartAddRequestCount,
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
} from "./helpers/ApplicationReview/prepare";

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.scrollTo = vi.fn();
  listenToMockServer();
  sessionStorage.setItem("onRouteBC.user.companyId", "74");
});

beforeEach(() => {
  policyWarningMocks.hasPolicyIssues = false;
  policyWarningMocks.policyWarnings = [];
  policyWarningMocks.axleCalculationResults = undefined;
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
        getPermitTypeName(permitType),
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
      expect(await companyNameLabel()).toHaveTextContent("CLIENT NAME");
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
      expect(
        await screen.getByText(companyInfoDescription),
      ).toBeInTheDocument();
    });

    it("should display proper company mailing address info", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const { addressLine1, city, countryCode, postalCode, provinceCode } =
        companyInfo.mailingAddress;

      const country = getCountryFullName(countryCode);
      const province = getProvinceFullName(countryCode, provinceCode);

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
      const newAdditionalEmail = "additionalEmail@mycompany.co";
      if (defaultApplicationData.permitData.contactDetails) {
        defaultApplicationData.permitData.contactDetails.additionalEmail =
          newAdditionalEmail;
      }

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
      expect(await contactInfoAdditionalEmail()).toHaveTextContent(
        `${newAdditionalEmail}`,
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
        additionalEmail: undefined,
        phone1: defaultApplicationData.permitData.contactDetails
          ?.phone1 as string,
        phone1Extension: undefined,
        phone2: undefined,
        phone2Extension: undefined,
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
      expect(async () => await contactInfoAdditionalEmail()).rejects.toThrow();
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

    it("should display selected conditions with links", async () => {
      // Arrange and Act
      renderTestComponent(defaultApplicationData);

      // Assert
      const conditions = defaultApplicationData.permitData.commodities;
      const descriptions = conditions.map((c) => c.description);
      const links = conditions.map((c) => c.conditionLink);
      const conditionCodes = conditions.map((c) => c.condition);
      const conditionRows = await permitConditions();
      const conditionDescriptions = await permitConditionDescriptions();
      const conditionLinks = await permitConditionLinks();
      const permitCondCodes = await permitConditionCodes();
      expect(conditionRows).toHaveLength(conditions.length);
      expect(conditionDescriptions).toHaveLength(descriptions.length);
      expect(conditionLinks).toHaveLength(links.length);
      expect(permitCondCodes).toHaveLength(conditionCodes.length);
      conditionDescriptions.forEach((desc) => {
        expect(descriptions).toContain(desc.textContent);
      });
      const descriptionText = conditionDescriptions.map((d) => d.textContent);
      descriptions.forEach((d) => {
        expect(descriptionText).toContain(d);
      });

      conditionLinks.forEach((link) => {
        expect(links).toContain(link.getAttribute("href"));
      });
      const linkHrefs = conditionLinks.map((l) => l.getAttribute("href"));
      links.forEach((l) => {
        expect(linkHrefs).toContain(l);
      });

      permitCondCodes.forEach((cond) => {
        expect(conditionCodes).toContain(cond.textContent);
      });
      const conditionCodesText = permitCondCodes.map((c) => c.textContent);
      conditionCodes.forEach((c) => {
        expect(conditionCodesText).toContain(c);
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
      } = defaultApplicationData.permitData
        .vehicleDetails as PermitVehicleDetails;

      const unit = getDefaultRequiredVal("", unitNumber);
      const country = getCountryFullName(countryCode);
      const province = getProvinceFullName(countryCode, provinceCode);
      const vehicleTypeStr = vehicleTypeDisplayText(vehicleType as VehicleType);
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
      await proceedToAddToCart(user);

      // Assert
      expect(await attestationErrorMsg()).toHaveTextContent(
        "Checkbox selection is required",
      );
    });

    it("should not show error message when all attestation checkboxes are checked", async () => {
      const { user } = renderTestComponent(defaultApplicationData);

      // Act
      await checkAttestations(user, [0, 1, 2]);
      await proceedToAddToCart(user);

      // Assert
      expect(async () => await attestationErrorMsg()).rejects.toThrow();
    });
  });

  describe("Staff STOW policy warning confirmation", () => {
    const staffStowApplication = {
      ...defaultApplicationData,
      permitType: PERMIT_TYPES.STOW,
    } as Application;

    it("keeps the application out of the cart when staff cancel", async () => {
      policyWarningMocks.hasPolicyIssues = true;
      const { user } = renderTestComponent(staffStowApplication, true);

      await checkAttestations(user, [0, 1, 2]);
      await proceedToAddToCart(user);

      expect(
        await screen.findByText(
          "Application has violation(s) and/or warning(s)",
        ),
      ).toBeVisible();
      await user.click(screen.getByTestId("cancel-review-button"));

      expect(cartAddRequestCount).toBe(0);
      expect(
        screen.queryByText("Application has violation(s) and/or warning(s)"),
      ).not.toBeInTheDocument();
    });

    it("uses the original add-to-cart flow when staff confirm", async () => {
      policyWarningMocks.hasPolicyIssues = true;
      const { user } = renderTestComponent(staffStowApplication, true);

      await checkAttestations(user, [0, 1, 2]);
      await proceedToAddToCart(user);
      await user.click(await screen.findByTestId("confirm-review-button"));

      await waitFor(() => expect(applicationSaveRequestCount).toBe(1));
    });

    it("adds directly when staff STOW has no policy issues", async () => {
      const { user } = renderTestComponent(staffStowApplication, true);

      await checkAttestations(user, [0, 1, 2]);
      await proceedToAddToCart(user);

      expect(
        screen.queryByText("Application has violation(s) and/or warning(s)"),
      ).not.toBeInTheDocument();
      await waitFor(() => expect(applicationSaveRequestCount).toBe(1));
    });

    it("does not show the staff modal to a CV user", async () => {
      policyWarningMocks.hasPolicyIssues = true;
      const { user } = renderTestComponent(staffStowApplication);

      await checkAttestations(user, [0, 1, 2]);
      await proceedToAddToCart(user);

      expect(
        screen.queryByText("Application has violation(s) and/or warning(s)"),
      ).not.toBeInTheDocument();
      await waitFor(() => expect(applicationSaveRequestCount).toBe(1));
    });
  });

  describe("STOW Axle Spacing and Weights review", () => {
    const stowApplication = {
      ...defaultApplicationData,
      permitType: PERMIT_TYPES.STOW,
      permitData: {
        ...defaultApplicationData.permitData,
        vehicleConfiguration: {
          axleConfiguration: [
            {
              numberOfAxles: 1,
              axleUnitWeight: 6700,
              numberOfTires: 2,
              tireSize: 355,
            },
            { interaxleSpacing: 3.5 },
            {
              numberOfAxles: 2,
              axleSpread: 1.6,
              axleUnitWeight: 12000,
              numberOfTires: 4,
              tireSize: 330,
            },
          ],
          trailers: [],
        },
      },
    } as Application;

    it.each([
      ["CV user", false],
      ["staff", true],
    ])("shows a read-only ASW table for %s", async (_, isStaff) => {
      policyWarningMocks.axleCalculationResults = {
        results: [
          {
            id: PolicyCheckId.MinSteerAxleWeight,
            result: PolicyCheckResultType.Warning,
            message: "Review the steer axle weight.",
            startAxleUnit: 1,
            endAxleUnit: 2,
          },
        ],
        totalGCVW: 18700,
        overload: 100,
      };

      renderTestComponent(stowApplication, isStaff);

      const vehicleHeading = await screen.findByRole("heading", {
        name: "Vehicle Information",
      });
      const aswHeading = screen.getByRole("heading", {
        name: "Axle Spacing and Weights",
      });

      expect(
        vehicleHeading.compareDocumentPosition(aswHeading) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(screen.getByDisplayValue("6700")).toBeDisabled();
      expect(screen.queryByRole("button", { name: "Calculate" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
      expect(screen.getByText("Total GCVW (kg):")).toBeVisible();
      expect(screen.getByText("Review the steer axle weight.")).toBeVisible();
    });
  });
});
