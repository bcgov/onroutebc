import { memo } from "react";
import Typography from "@mui/material/Typography";

import "./CompanyInformationWizardForm.scss";
import { CompanyInfoGeneralForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyInfoGeneralForm";
import { CompanyContactDetailsForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyContactDetailsForm";
import { CompanyPrimaryContactForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyPrimaryContactForm";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import {
  invalidDBALength,
  isValidOptionalString,
} from "../../../common/helpers/validationMessages";
import { useFormContext } from "react-hook-form";

/**
 * The Company Wizard Form contains multiple subs forms including
 * Company Info, Company Contact, and Primary Contact forms.
 */
export const CompanyInformationWizardForm = memo(() => {
  const FEATURE = "wizard";
  const { register } = useFormContext();

  return (
    <div className="company-info-wizard-form">
      {/* <input type="hidden" {...register("legalName")} /> */}
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
