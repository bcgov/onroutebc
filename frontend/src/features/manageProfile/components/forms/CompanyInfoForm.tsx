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
  CustomOutlinedInput,
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
    <CustomOutlinedInput
      common={commonFormProps}
      name={"address1"}
      rules={{ required: true }}
      label={"Address (Line 1)"}
      inValidMessage={"Address is required"}
      options={{}}
    />
    <CustomOutlinedInput
      common={commonFormProps}
      name={"address2"}
      rules={{ required: false }}
      label={"Address (Line 2)"}
      inValidMessage={""}
      options={{}}
    />
    <CountryAndProvince
      country={companyInfo?.country ? companyInfo.country : ""}
      province={companyInfo?.province ? companyInfo.province : ""}
      width={DEFAULT_WIDTH}
      countryField={"primaryCountry"}
      provinceField={"primaryProvince"}
    />

    <div className="mp-side-by-side-container">
      <CustomOutlinedInput
        common={commonFormProps}
        name={"city"}
        rules={{ required: true }}
        label={"City"}
        inValidMessage={"City is required"}
        options={{ width: CITY_WIDTH }}
      />
      <CustomOutlinedInput
        common={commonFormProps}
        name={"postalCode"}
        rules={{ required: true }}
        label={"Postal / Zip Code"}
        inValidMessage={"Postal / Zip Code is required"}
        options={{ width: POSTAL_WIDTH }}
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
    <CustomOutlinedInput
      common={commonFormProps}
      name={"email"}
      rules={{ required: false }}
      label={"Email"}
      inValidMessage={""}
      options={{}}
    />
    <div className="mp-side-by-side-container">
      <CustomOutlinedInput
        common={commonFormProps}
        name={"phone"}
        rules={{ required: true }}
        label={"Phone Number"}
        inValidMessage={"Phone Number is required"}
        options={{ width: PHONE_WIDTH }}
      />

      <CustomOutlinedInput
        common={commonFormProps}
        name={"ext"}
        rules={{ required: false }}
        label={"Ext"}
        inValidMessage={""}
        options={{ width: EXT_WIDTH }}
      />
    </div>
    <CustomOutlinedInput
      common={commonFormProps}
      name={"fax"}
      rules={{ required: false }}
      label={"Fax"}
      inValidMessage={""}
      options={{ width: PHONE_WIDTH }}
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

          <CustomOutlinedInput
            common={commonFormProps}
            name={"mail_address1"}
            rules={{ required: true }}
            label={"Address (Line 1)"}
            inValidMessage={"Address is required"}
            options={{}}
          />
          <CustomOutlinedInput
            common={commonFormProps}
            name={"mail_address2"}
            rules={{ required: false }}
            label={"Address (Line 2)"}
            inValidMessage={""}
            options={{}}
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
            <CustomOutlinedInput
              common={commonFormProps}
              name={"mail_city"}
              rules={{ required: true }}
              label={"City"}
              inValidMessage={"City is required"}
              options={{ width: CITY_WIDTH }}
            />
            <CustomOutlinedInput
              common={commonFormProps}
              name={"mail_postalCode"}
              rules={{ required: true }}
              label={"Postal / Zip Code"}
              inValidMessage={"Postal / Zip Code is required"}
              options={{ width: POSTAL_WIDTH }}
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
    <CustomOutlinedInput
      common={commonFormProps}
      name={"firstName"}
      rules={{ required: true }}
      label={"First Name"}
      inValidMessage={"First Name is required"}
      options={{}}
    />
    <CustomOutlinedInput
      common={commonFormProps}
      name={"lastName"}
      rules={{ required: true }}
      label={"Last Name"}
      inValidMessage={"Last Name is required"}
      options={{}}
    />
    <CustomOutlinedInput
      common={commonFormProps}
      name={"primaryEmail"}
      rules={{ required: true }}
      label={"Email"}
      inValidMessage={"Email is required"}
      options={{}}
    />
    <div className="mp-side-by-side-container">
      <CustomOutlinedInput
        common={commonFormProps}
        name={"primaryPhone"}
        rules={{ required: true }}
        label={"Primary Phone"}
        inValidMessage={"Primary Phone is required"}
        options={{ width: PHONE_WIDTH }}
      />
      <CustomOutlinedInput
        common={commonFormProps}
        name={"primaryPhoneExt"}
        rules={{ required: false }}
        label={"Ext"}
        inValidMessage={""}
        options={{ width: EXT_WIDTH }}
      />
    </div>
    <div className="mp-side-by-side-container">
      <CustomOutlinedInput
        common={commonFormProps}
        name={"alternatePhone"}
        rules={{ required: false }}
        label={"Alternate Phone"}
        inValidMessage={""}
        options={{ width: PHONE_WIDTH }}
      />
      <CustomOutlinedInput
        common={commonFormProps}
        name={"alternatePhoneExt"}
        rules={{ required: false }}
        label={"Ext"}
        inValidMessage={""}
        options={{ width: EXT_WIDTH }}
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
    <CustomOutlinedInput
      common={commonFormProps}
      name={"primaryCity"}
      rules={{ required: true }}
      label={"City"}
      inValidMessage={"City is required"}
      options={{}}
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
