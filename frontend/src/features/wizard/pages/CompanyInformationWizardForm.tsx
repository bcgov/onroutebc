import { memo } from "react";
import Typography from "@mui/material/Typography";

import "./CompanyInformationWizardForm.scss";
import { CompanyInfoGeneralForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyInfoGeneralForm";
import { CompanyContactDetailsForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyContactDetailsForm";
import { CompanyPrimaryContactForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyPrimaryContactForm";
import { InfoBcGovBanner } from "../../../common/components/banners/AlertBanners";

/**
 * The User Information Form contains multiple subs forms including
 * Company Info, Company Contact, Primary Contact, and Mailing Address Forms.
 * This Component contains the logic for React Hook forms and React query
 * for state management and API calls
 */
export const CompanyInformationWizardForm = memo(() => {
  const FEATURE = "wizard";

  return (
    <div className="company-info-wizard-form">
      
      <CompanyInfoGeneralForm feature={FEATURE} />

      <Typography variant="h2" gutterBottom>
        Company Contact Details
      </Typography>

      <CompanyContactDetailsForm feature={FEATURE} />

      <Typography variant="h2" gutterBottom>
        Company Primary Contact
      </Typography>

      <InfoBcGovBanner description="The Company Primary Contact will be contacted for all onRouteBC client profile queries." />

      <CompanyPrimaryContactForm feature={FEATURE} />
    </div>
  );
});

CompanyInformationWizardForm.displayName = "CompanyInformationWizardForm";
