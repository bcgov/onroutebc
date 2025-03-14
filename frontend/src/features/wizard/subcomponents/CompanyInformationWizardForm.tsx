import Typography from "@mui/material/Typography";
import { memo } from "react";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import {
  invalidDBALength,
  isValidOptionalString,
} from "../../../common/helpers/validationMessages";
import { CompanyInfoGeneralForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyInfoGeneralForm";
import "./CompanyInformationWizardForm.scss";
import { ORBC_FORM_FEATURES } from "../../../common/types/common";
import { WarningBcGovBanner } from "../../../common/components/banners/WarningBcGovBanner";
import { CompanyPrimaryContactForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyPrimaryContactForm";
/**
 * The Company Wizard Form contains multiple subs forms including
 * Company Info, Company Contact, and Primary Contact forms.
 */
export const CompanyInformationWizardForm = memo(
  ({ showCompanyName = false }: { showCompanyName?: boolean }) => {
    const FEATURE = ORBC_FORM_FEATURES.COMPANY_INFORMATION_WIZARD;

    return (
      <div className="company-info-wizard-form">
        {showCompanyName && (
          <>
            <Typography
              variant="h2"
              className="company-info-wizard-form__heading"
            >
              Client Name
            </Typography>
            <WarningBcGovBanner
              className="company-info-wizard-form__banner"
              msg={BANNER_MESSAGES.CLIENT_NAME_MUST_BE_REGISTERED_OWNER}
            />
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "legalName",
                rules: {
                  required: true,
                  validate: {
                    validateLegalName: (legalName: string) =>
                      isValidOptionalString(legalName, {
                        maxLength: 150,
                      }) || invalidDBALength(1, 150),
                  },
                },
                label: "Client Name",
              }}
            />
          </>
        )}
        <Typography variant="h2" className="company-info-wizard-form__heading">
          Doing Business As (DBA)
        </Typography>
        <CustomFormComponent
          type="input"
          feature={FEATURE}
          options={{
            name: "alternateName",
            rules: {
              required: false,
              validate: {
                validateAlternateName: (alternateName: string) =>
                  isValidOptionalString(alternateName, { maxLength: 150 }) ||
                  invalidDBALength(1, 150),
              },
            },
            label: "DBA",
          }}
        />

        <Typography variant="h2" className="company-info-wizard-form__heading">
          Contact Details
        </Typography>
        <CompanyPrimaryContactForm feature={FEATURE} />
        <CompanyInfoGeneralForm feature={FEATURE} />
      </div>
    );
  },
);

CompanyInformationWizardForm.displayName = "CompanyInformationWizardForm";
