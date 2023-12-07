import { memo } from "react";
import Typography from "@mui/material/Typography";

import "./CompanyInformationWizardForm.scss";
import { CompanyInfoGeneralForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyInfoGeneralForm";
import { CompanyContactDetailsForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyContactDetailsForm";
import { CompanyPrimaryContactForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyPrimaryContactForm";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";

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
              validateAlternateName: (alternateName?: string) =>
                alternateName == null ||
                alternateName === "" ||
                (alternateName &&
                  alternateName.length >= 1 &&
                  alternateName.length <= 150),
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

      <InfoBcGovBanner
        msg={BANNER_MESSAGES.COMPANY_CONTACT} 
      />

      <CompanyPrimaryContactForm feature={FEATURE} />
    </div>
  );
});

CompanyInformationWizardForm.displayName = "CompanyInformationWizardForm";
