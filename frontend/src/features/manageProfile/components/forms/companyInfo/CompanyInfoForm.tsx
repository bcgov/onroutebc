import { Button, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { updateCompanyInfo } from "../../../apiManager/manageProfileAPI";

import "./CompanyInfoForms.scss";
import { CompanyInfoGeneralForm } from "./subForms/CompanyInfoGeneralForm";
import { CompanyContactDetailsForm } from "./subForms/CompanyContactDetailsForm";
import { CompanyPrimaryContactForm } from "./subForms/CompanyPrimaryContactForm";
import { formatPhoneNumber } from "../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { InfoBcGovBanner } from "../../../../../common/components/banners/AlertBanners";
import { CompanyProfile } from "../../../types/manageProfile";
import { transformNullableStrToStr } from "../../../../../common/helpers/util";

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
        clientNumber: transformNullableStrToStr(companyInfo?.clientNumber),
        legalName: transformNullableStrToStr(companyInfo?.legalName),
        mailingAddress: {
          addressLine1: transformNullableStrToStr(companyInfo?.mailingAddress?.addressLine1),
          addressLine2: transformNullableStrToStr(companyInfo?.mailingAddress?.addressLine2),
          city: transformNullableStrToStr(companyInfo?.mailingAddress?.city),
          provinceCode: transformNullableStrToStr(companyInfo?.mailingAddress?.provinceCode),
          countryCode: transformNullableStrToStr(companyInfo?.mailingAddress?.countryCode),
          postalCode: transformNullableStrToStr(companyInfo?.mailingAddress?.postalCode),
        },
        email: transformNullableStrToStr(companyInfo?.email),
        phone: transformNullableStrToStr(companyInfo?.phone, formatPhoneNumber),
        extension: transformNullableStrToStr(companyInfo?.extension),
        fax: transformNullableStrToStr(companyInfo?.fax),
        primaryContact: {
          firstName: transformNullableStrToStr(companyInfo?.primaryContact?.firstName),
          lastName: transformNullableStrToStr(companyInfo?.primaryContact?.lastName),
          phone1: transformNullableStrToStr(companyInfo?.primaryContact?.phone1, formatPhoneNumber),
          phone1Extension: transformNullableStrToStr(companyInfo?.primaryContact?.phone1Extension),
          phone2: transformNullableStrToStr(companyInfo?.primaryContact?.phone2, formatPhoneNumber),
          phone2Extension: transformNullableStrToStr(companyInfo?.primaryContact?.phone2Extension),
          email: transformNullableStrToStr(companyInfo?.primaryContact?.email),
          city: transformNullableStrToStr(companyInfo?.primaryContact?.city),
          provinceCode: transformNullableStrToStr(companyInfo?.primaryContact?.provinceCode),
          countryCode: transformNullableStrToStr(companyInfo?.primaryContact?.countryCode),
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
        } // else { // Display Error in the form }
      },
    });

    const onUpdateCompanyInfo = function (data: FieldValues) {
      const companyInfoToBeUpdated = data as CompanyProfile;
      addCompanyInfoQuery.mutate({
        companyInfo: companyInfoToBeUpdated,
      });
    };

    const FEATURE = "company-profile";

    return (
      <div className="mp-form-container">
        <FormProvider {...formMethods}>
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
