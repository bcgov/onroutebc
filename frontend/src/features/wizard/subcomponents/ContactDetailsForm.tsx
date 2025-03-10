import { CompanyPrimaryContactForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyPrimaryContactForm";
import { CompanyInfoGeneralForm } from "../../manageProfile/components/forms/companyInfo/subForms/CompanyInfoGeneralForm";
import { ORBCFormFeatureType } from "../../../common/types/common";

export const ContactDetailsForm = ({
  feature,
}: {
  feature: ORBCFormFeatureType;
}) => {
  return (
    <div className="company-contact-details-form">
      <CompanyPrimaryContactForm feature={feature} />
      <CompanyInfoGeneralForm feature={feature} />
    </div>
  );
};
