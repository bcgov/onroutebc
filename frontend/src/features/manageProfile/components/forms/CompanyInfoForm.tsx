import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import {
  CompanyProfile,
  updateCompanyInfo,
} from "../../apiManager/manageProfileAPI";
import {
  CommonFormPropsType,
  CustomFormComponent,
} from "../../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../../common/components/alertBanners/AlertBanners";

import "./CompanyInfoForms.scss";

const DEFAULT_WIDTH = "528px";
const CITY_WIDTH = "304px";
const POSTAL_WIDTH = "184px";
const PHONE_WIDTH = "344px";
const EXT_WIDTH = "144px";

const CompanyInfoGeneralForm = ({
  commonFormProps,
  companyInfo,
}: {
  commonFormProps: CommonFormPropsType<CompanyProfile>;
  companyInfo?: CompanyProfile;
}) => (
  <>
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "companyAddress.addressLine1",
        rules: { required: true },
        label: "Address (Line 1)",
        inValidMessage: "Address is required",
      }}
    />

    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "companyAddress.addressLine2",
        rules: { required: false },
        label: "Address (Line 2)",
      }}
    />

    <CountryAndProvince
      country={
        companyInfo?.companyAddress.countryCode
          ? companyInfo.companyAddress.countryCode
          : ""
      }
      province={
        companyInfo?.companyAddress.provinceCode
          ? companyInfo.companyAddress.provinceCode
          : ""
      }
      width={DEFAULT_WIDTH}
      countryField={"companyAddress.countryCode"}
      provinceField={"companyAddress.provinceCode"}
      feature="profile"
    />

    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "companyAddress.city",
          rules: { required: true },
          label: "City",
          inValidMessage: "City is required",
          width: CITY_WIDTH,
        }}
      />
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "companyAddress.postalCode",
          rules: { required: true },
          label: "Postal / Zip Code",
          inValidMessage: "Postal / Zip Code is required",
          width: POSTAL_WIDTH,
        }}
      />
    </div>
  </>
);

const CompanyContactDetailsForm = ({
  commonFormProps,
}: {
  commonFormProps: CommonFormPropsType<CompanyProfile>;
}) => (
  <>
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "email",
        rules: { required: false },
        label: "Email",
      }}
    />
    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "phone",
          rules: { required: true },
          label: "Phone Number",
          inValidMessage: "Phone Number is required",
          width: PHONE_WIDTH,
          displayAs: "phone",
          inputProps: { maxLength: 20 },
        }}
      />
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "extension",
          rules: { required: false },
          label: "Ext",
          width: EXT_WIDTH,
        }}
      />
    </div>
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "fax",
        rules: { required: false },
        label: "Fax",
        width: PHONE_WIDTH,
      }}
    />
  </>
);

const CompanyMailingAddressForm = ({
  commonFormProps,
  companyInfo,
}: {
  companyInfo?: CompanyProfile;
  commonFormProps: CommonFormPropsType<CompanyProfile>;
}) => {
  const [showMailingAddress, setShowMailingAddress] = useState(false);
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={() => setShowMailingAddress(!showMailingAddress)}
              inputProps={{
                "aria-label": "Mailing Address Checkbox",
              }}
            />
          }
          label="Mailing address is the same as company address"
        />
      </FormGroup>

      {showMailingAddress ? (
        <>
          <Typography variant="h2" gutterBottom>
            Company Mailing Address
          </Typography>

          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
            options={{
              name: "mailingAddress.addressLine1",
              rules: { required: true },
              label: "Address (Line 1)",
              inValidMessage: "Address is required",
            }}
          />
          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
            options={{
              name: "mailingAddress.addressLine2",
              rules: { required: false },
              label: "Address (Line 2)",
            }}
          />
          <CountryAndProvince
            country={
              companyInfo?.mailingAddress?.countryCode
                ? companyInfo.mailingAddress.countryCode
                : ""
            }
            province={
              companyInfo?.mailingAddress?.provinceCode
                ? companyInfo.mailingAddress.provinceCode
                : ""
            }
            feature={"profile"}
            width={DEFAULT_WIDTH}
          />
          <div className="mp-side-by-side-container">
            <CustomFormComponent
              type="input"
              commonFormProps={commonFormProps}
              options={{
                name: "mailingAddress.city",
                rules: { required: true },
                label: "City",
                inValidMessage: "City is required",
                width: CITY_WIDTH,
              }}
            />
            <CustomFormComponent
              type="input"
              commonFormProps={commonFormProps}
              options={{
                name: "mailingAddress.postalCode",
                rules: { required: true },
                label: "Postal / Zip Code",
                inValidMessage: "Postal / Zip Code is required",
                width: POSTAL_WIDTH,
              }}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

const CompanyPrimaryContactForm = ({
  commonFormProps,
  companyInfo,
}: {
  companyInfo?: CompanyProfile;
  commonFormProps: CommonFormPropsType<CompanyProfile>;
}) => (
  <>
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "primaryContact.firstName",
        rules: { required: true },
        label: "First Name",
        inValidMessage: "First Name is required",
      }}
    />
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "primaryContact.lastName",
        rules: { required: true },
        label: "Last Name",
        inValidMessage: "Last Name is required",
      }}
    />
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "primaryContact.email",
        rules: { required: true },
        label: "Email",
        inValidMessage: "Email is required",
      }}
    />

    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "primaryContact.phone1",
          rules: { required: true },
          label: "Phone Number",
          inValidMessage: "Phone Number is required",
          width: PHONE_WIDTH,
          displayAs: "phone",
        }}
      />
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "primaryContact.phone1Extension",
          rules: { required: false },
          label: "Ext",
          width: EXT_WIDTH,
        }}
      />
    </div>
    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "primaryContact.phone2",
          rules: { required: false },
          label: "Alternate Number",
          width: PHONE_WIDTH,
          displayAs: "phone",
        }}
      />
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "primaryContact.phone2Extension",
          rules: { required: false },
          label: "Ext",
          width: EXT_WIDTH,
        }}
      />
    </div>

    <CountryAndProvince
      country={
        companyInfo?.primaryContact?.countryCode
          ? companyInfo.primaryContact.countryCode
          : ""
      }
      province={
        companyInfo?.primaryContact?.provinceCode
          ? companyInfo.primaryContact.provinceCode
          : ""
      }
      width={DEFAULT_WIDTH}
      countryField={"primaryContact.countryCode"}
      provinceField={"primaryContact.provinceCode"}
      feature={"profile"}
      rules={{ required: false }}
    />
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "primaryContact.city",
        rules: { required: true },
        label: "City",
        inValidMessage: "City is required",
        width: CITY_WIDTH,
      }}
    />
  </>
);

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
        mailingAddressSameAsCompanyAddress: true,
        mailingAddress: {
          addressLine1: companyInfo?.mailingAddress?.addressLine1 || "",
          addressLine2: companyInfo?.mailingAddress?.addressLine2 || "",
          city: companyInfo?.mailingAddress?.city || "",
          provinceCode: companyInfo?.mailingAddress?.provinceCode || "",
          countryCode: companyInfo?.mailingAddress?.countryCode || "",
          postalCode: companyInfo?.mailingAddress?.postalCode || "",
        },
        email: companyInfo?.email || "",
        phone: companyInfo?.phone || "",
        extension: companyInfo?.extension || "",
        fax: companyInfo?.fax || "",
        primaryContact: {
          firstName: companyInfo?.primaryContact?.firstName || "",
          lastName: companyInfo?.primaryContact?.lastName || "",
          phone1: companyInfo?.primaryContact?.phone1 || "",
          phone1Extension: companyInfo?.primaryContact?.phone1Extension || "",
          phone2: companyInfo?.primaryContact?.phone2 || "",
          phone2Extension: companyInfo?.primaryContact?.phone2Extension || "",
          email: companyInfo?.primaryContact?.email || "",
          city: companyInfo?.primaryContact?.city || "",
          provinceCode: companyInfo?.primaryContact?.provinceCode || "",
          countryCode: companyInfo?.primaryContact?.countryCode || "",
        },
      },
    });

    const { register, handleSubmit, control, getValues } = formMethods;

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

    const commonFormProps: CommonFormPropsType<CompanyProfile> = {
      control: control,
      register: register,
      feature: "profile",
      getValues: getValues,
    };

    return (
      <div className="mp-form-container">
        <FormProvider {...formMethods}>
          <CompanyInfoGeneralForm
            commonFormProps={commonFormProps}
            companyInfo={companyInfo}
          />

          <CompanyMailingAddressForm
            commonFormProps={commonFormProps}
            companyInfo={companyInfo}
          />

          <Typography variant="h2" gutterBottom>
            Company Contact Details
          </Typography>

          <CompanyContactDetailsForm commonFormProps={commonFormProps} />

          <Typography variant="h2" gutterBottom>
            Company Primary Contact
          </Typography>

          <InfoBcGovBanner description="The Company Primary Contact will be contacted for all onRouteBC client profile queries." />

          <CompanyPrimaryContactForm
            commonFormProps={commonFormProps}
            companyInfo={companyInfo}
          />
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
