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

/**
 * The Company Wizard Form contains multiple subs forms including
 * Company Info, Company Contact, and Primary Contact forms.
 */
export const CompanyInformationWizardForm = memo(() => {
  const FEATURE = "wizard";

  return (
    <div className="company-info-wizard-form">
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

      <CompanyContactDetailsForm feature={FEATURE} />

      <Typography variant="h2" gutterBottom>
        Company Primary Contact
      </Typography>

      <InfoBcGovBanner msg={BANNER_MESSAGES.COMPANY_CONTACT} />

      <CompanyPrimaryContactForm feature={FEATURE} />
    </div>
  );
});

CompanyInformationWizardForm.displayName = "CompanyInformationWizardForm";
