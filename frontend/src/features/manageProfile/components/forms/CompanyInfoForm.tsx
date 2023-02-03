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
  ICompanyInfo,
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
  commonFormProps: CommonFormPropsType<ICompanyInfo>;
  companyInfo?: ICompanyInfo;
}) => (
  <>
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "address1",
        rules: { required: true },
        label: "Address (Line 1)",
        inValidMessage: "Address is required",
      }}
    />

    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "address2",
        rules: { required: false },
        label: "Address (Line 2)",
      }}
    />

    <CountryAndProvince
      country={companyInfo?.country ? companyInfo.country : ""}
      province={companyInfo?.province ? companyInfo.province : ""}
      width={DEFAULT_WIDTH}
      countryField={"primaryCountry"}
      provinceField={"primaryProvince"}
    />

    <div className="mp-side-by-side-container">
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "city",
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
          name: "postalCode",
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
  commonFormProps: CommonFormPropsType<ICompanyInfo>;
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
        }}
      />
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "ext",
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
  companyInfo?: ICompanyInfo;
  commonFormProps: CommonFormPropsType<ICompanyInfo>;
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
              name: "mail_address1",
              rules: { required: true },
              label: "Address (Line 1)",
              inValidMessage: "Address is required",
            }}
          />
          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
            options={{
              name: "mail_address2",
              rules: { required: false },
              label: "Address (Line 2)",
            }}
          />
          <CountryAndProvince
            country={companyInfo?.mail_country ? companyInfo.mail_country : ""}
            province={
              companyInfo?.mail_province ? companyInfo.mail_province : ""
            }
            feature={"profile"}
            width={DEFAULT_WIDTH}
          />
          <div className="mp-side-by-side-container">
            <CustomFormComponent
              type="input"
              commonFormProps={commonFormProps}
              options={{
                name: "mail_city",
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
                name: "mail_postalCode",
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
  companyInfo?: ICompanyInfo;
  commonFormProps: CommonFormPropsType<ICompanyInfo>;
}) => (
  <>
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "firstName",
        rules: { required: true },
        label: "First Name",
        inValidMessage: "First Name is required",
      }}
    />
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "lastName",
        rules: { required: true },
        label: "Last Name",
        inValidMessage: "Last Name is required",
      }}
    />
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "primaryEmail",
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
          name: "primaryPhone",
          rules: { required: true },
          label: "Phone Number",
          inValidMessage: "Phone Number is required",
          width: PHONE_WIDTH,
        }}
      />
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "primaryPhoneExt",
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
          name: "alternatePhone",
          rules: { required: false },
          label: "Alternate Number",
          width: PHONE_WIDTH,
        }}
      />
      <CustomFormComponent
        type="input"
        commonFormProps={commonFormProps}
        options={{
          name: "alternatePhoneExt",
          rules: { required: false },
          label: "Ext",
          width: EXT_WIDTH,
        }}
      />
    </div>

    <CountryAndProvince
      country={companyInfo?.primaryCountry ? companyInfo.primaryCountry : ""}
      province={companyInfo?.primaryProvince ? companyInfo.primaryProvince : ""}
      width={DEFAULT_WIDTH}
      countryField={"secondaryCountry"}
      provinceField={"secondaryProvince"}
      feature={"profile"}
      rules={{ required: false }}
    />
    <CustomFormComponent
      type="input"
      commonFormProps={commonFormProps}
      options={{
        name: "primaryCity",
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
    companyInfo?: ICompanyInfo;
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const formMethods = useForm<ICompanyInfo>({
      defaultValues: {},
    });

    const { register, handleSubmit, control } = formMethods;

    const queryClient = useQueryClient();

    const addCompanyInfoQuery = useMutation({
      mutationFn: updateCompanyInfo,
      onSuccess: (response) => {
        if (response.status === 201) {
          queryClient.invalidateQueries(["companyInfo"]);
        } else {
          // Display Error in the form.
        }
      },
    });

    const onUpdateCompanyInfo = function (data: FieldValues) {
      const companyInfoToBeUpdated = data as ICompanyInfo;
      addCompanyInfoQuery.mutate(companyInfoToBeUpdated);
    };

    const commonFormProps: CommonFormPropsType<ICompanyInfo> = {
      control: control,
      register: register,
      feature: "profile",
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
            color="secondary"
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
            Update
          </Button>
        </div>
      </div>
    );
  }
);

CompanyInfoForm.displayName = "CompanyInfoForm";
