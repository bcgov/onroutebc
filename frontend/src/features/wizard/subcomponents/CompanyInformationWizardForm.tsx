import Typography from "@mui/material/Typography";
import { memo } from "react";

import { InfoBcGovBanner } from "../../../common/components/banners/InfoBcGovBanner";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import {
  invalidDBALength,
  isValidOptionalString,
} from "../../../common/helpers/validationMessages";
import { CompanyContactDetailsForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyContactDetailsForm";
import { CompanyInfoGeneralForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyInfoGeneralForm";
import { CompanyPrimaryContactForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyPrimaryContactForm";
import "./CompanyInformationWizardForm.scss";
import { ORBC_FORM_FEATURES } from "../../../common/types/common";

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
            <Typography variant="h2" gutterBottom>
              Company Name
            </Typography>
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
                label: "Company Name",
              }}
            />
          </>
        )}
        <Typography variant="h2" gutterBottom>
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
        <Typography variant="h2" gutterBottom>
          Company Mailing Address
        </Typography>
        <CompanyInfoGeneralForm feature={FEATURE} />

        <Typography variant="h2" gutterBottom>
          Company Contact Details
        </Typography>

        <CompanyContactDetailsForm
          feature={FEATURE}
          // Currently, companyName is displayed only for idir users
          // So, If idir user is creating a company, enable the email field.
          // i.e., showCompanyName and disableEmail have opposite values.
          disableEmail={showCompanyName ? false : true}
        />

        <Typography variant="h2" gutterBottom>
          Company Primary Contact
        </Typography>

        <InfoBcGovBanner
          className="company-info-wizard-form__info-banner"
          msg={BANNER_MESSAGES.COMPANY_CONTACT}
        />

        <CompanyPrimaryContactForm feature={FEATURE} />
      </div>
    );
  },
);

CompanyInformationWizardForm.displayName = "CompanyInformationWizardForm";
