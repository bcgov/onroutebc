import { Button, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import {
  CompanyProfile,
  updateCompanyInfo,
} from "../../apiManager/manageProfileAPI";
import { InfoBcGovBanner } from "../../../../common/components/alertBanners/AlertBanners";

import "./CompanyInfoForms.scss";
import { CompanyInfoGeneralForm } from "./subForms/CompanyInfoGeneralForm";
import { CompanyContactDetailsForm } from "./subForms/CompanyContactDetailsForm";
import { CompanyMailingAddressForm } from "./subForms/CompanyMailingAddressForm";
import { CompanyPrimaryContactForm } from "./subForms/CompanyPrimaryContactForm";
import { formatPhoneNumber } from "../../../../common/components/form/subFormComponents/PhoneNumberInput";

/**
 * The Company Information Form contains multiple subs forms including
 * Company Info, Company Contact, Primary Contact, and Mailing Address Forms.
 * This Component contains the logic for React Hook forms and React query
 * for state management and API calls
 */
export const CompanyInfoForm = memo(
  ({
    companyInfo,
    setIsEditting,
  }: {
    companyInfo?: CompanyProfile;
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const queryClient = useQueryClient();

    const formMethods = useForm<CompanyProfile>({
      defaultValues: {
        clientNumber: companyInfo?.clientNumber || "",
        legalName: companyInfo?.legalName || "",
        companyAddress: {
          addressLine1: companyInfo?.companyAddress?.addressLine1 || "",
          addressLine2: companyInfo?.companyAddress?.addressLine2 || "",
          city: companyInfo?.companyAddress?.city || "",
          provinceCode: companyInfo?.companyAddress?.provinceCode || "",
          countryCode: companyInfo?.companyAddress?.countryCode || "",
          postalCode: companyInfo?.companyAddress?.postalCode || "",
        },
        mailingAddressSameAsCompanyAddress:
          companyInfo?.mailingAddressSameAsCompanyAddress,
        mailingAddress: {
          addressLine1: companyInfo?.mailingAddress?.addressLine1 || "",
          addressLine2: companyInfo?.mailingAddress?.addressLine2 || "",
          city: companyInfo?.mailingAddress?.city || "",
          provinceCode: companyInfo?.mailingAddress?.provinceCode || "",
          countryCode: companyInfo?.mailingAddress?.countryCode || "",
          postalCode: companyInfo?.mailingAddress?.postalCode || "",
        },
        email: companyInfo?.email || "",
        phone: companyInfo?.phone ? formatPhoneNumber(companyInfo?.phone) : "",
        extension: companyInfo?.extension || "",
        fax: companyInfo?.fax || "",
        primaryContact: {
          firstName: companyInfo?.primaryContact?.firstName || "",
          lastName: companyInfo?.primaryContact?.lastName || "",
          phone1: companyInfo?.primaryContact?.phone1
            ? formatPhoneNumber(companyInfo?.primaryContact?.phone1)
            : "",
          phone1Extension: companyInfo?.primaryContact?.phone1Extension || "",
          phone2: companyInfo?.primaryContact?.phone2
            ? formatPhoneNumber(companyInfo?.primaryContact?.phone2)
            : "",
          phone2Extension: companyInfo?.primaryContact?.phone2Extension || "",
          email: companyInfo?.primaryContact?.email || "",
          city: companyInfo?.primaryContact?.city || "",
          provinceCode: companyInfo?.primaryContact?.provinceCode || "",
          countryCode: companyInfo?.primaryContact?.countryCode || "",
        },
      },
    });

    const { handleSubmit } = formMethods;

    const addCompanyInfoQuery = useMutation({
      mutationFn: updateCompanyInfo,
      onSuccess: (response) => {
        console.log(response.status);
        if (response.status === 200) {
          queryClient.invalidateQueries(["companyInfo"]);
          setIsEditting(false);
        } else {
          // Display Error in the form.
        }
      },
    });

    const onUpdateCompanyInfo = function (data: FieldValues) {
      const companyInfoToBeUpdated = data as CompanyProfile;
      addCompanyInfoQuery.mutate({
        companyGUID: "TEST_changeme",
        companyInfo: companyInfoToBeUpdated,
      });
    };

    const FEATURE = "company-profile";

    return (
      <div className="mp-form-container">
        <FormProvider {...formMethods}>
          <CompanyInfoGeneralForm feature={FEATURE} />

          <CompanyMailingAddressForm
            feature={FEATURE}
            companyInfo={companyInfo}
          />

          <Typography variant="h2" gutterBottom>
            Company Contact Details
          </Typography>

          <CompanyContactDetailsForm feature={FEATURE} />

          <Typography variant="h2" gutterBottom>
            Company Primary Contact
          </Typography>

          <InfoBcGovBanner description="The Company Primary Contact will be contacted for all onRouteBC client profile queries." />

          <CompanyPrimaryContactForm feature={FEATURE} />
        </FormProvider>
        <div className="mp-form-submit-container">
          <Button
            key="update-company-info-cancel-button"
            aria-label="Cancel Update"
            variant="contained"
            color="tertiary"
            sx={{ marginRight: "40px" }}
            onClick={() => setIsEditting(false)}
          >
            Cancel
          </Button>
          <Button
            key="update-company-info-button"
            aria-label="Update Company Info"
            variant="contained"
            color="primary"
            onClick={handleSubmit(onUpdateCompanyInfo)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
);

CompanyInfoForm.displayName = "CompanyInfoForm";
