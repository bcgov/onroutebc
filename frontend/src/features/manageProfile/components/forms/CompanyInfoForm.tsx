import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import {
  getCompanyInfo,
  ICompanyInfo,
  updateCompanyInfo,
} from "../../apiManager/manageProfileAPI";
import { CustomOutlinedInput } from "../../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../../common/components/alertBanners/AlertBanners";

import "./CompanyInfoForms.scss";

export interface CompanyInfoFormValues {
  address1: string;
  address2: string;
  address: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  email: string;
  phone: string;
  fax: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  primaryPhone: string;
  alternatePhone: string;
  primaryCountry: string;
  primaryProvince: string;
  primaryCity: string;

  mail_address1: string;
  mail_address2: string;
  mail_country: string;
  mail_province: string;
  mail_city: string;
  mail_postalCode: string;
}

export const CompanyInfoForm = memo(
  ({
    companyInfo,
    setIsEditting,
  }: {
    companyInfo?: ICompanyInfo;
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const formMethods = useForm<CompanyInfoFormValues>({
      defaultValues: {
        address1: "",
        address2: "",
        address: "",
        country: "",
        province: "",
        city: "",
        postalCode: "",
        email: "",
        phone: "",
        fax: "",
        firstName: "",
        lastName: "",
        primaryEmail: "",
        primaryPhone: "",
        alternatePhone: "",
        primaryCountry: "",
        primaryProvince: "",
        primaryCity: "",
        mail_address1: "",
        mail_address2: "",
        mail_country: "",
        mail_province: "",
        mail_city: "",
        mail_postalCode: "",
      },
    });

    const queryClient = useQueryClient();

    const companyInfoQuery = useQuery({
      queryKey: ["companyInfo"],
      queryFn: getCompanyInfo,
      retry: false,
    });

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

    /**
     * Adds a vehicle.
     */
    const onUpdateCompanyInfo = function (data: FieldValues) {
      const companyInfoToBeUpdated = data as ICompanyInfo;
      addCompanyInfoQuery.mutate(companyInfoToBeUpdated);
    };

    const { register, handleSubmit, control } = formMethods;

    const [showMailingAddress, setShowMailingAddress] = useState(false);

    return (
      <div className="mp-form-container">
        <FormProvider {...formMethods}>
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"address1"}
            rules={{ required: true }}
            label={"Address (Line 1)"}
            feature={"profile"}
            inValidMessage={"Address is required"}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"address2"}
            rules={{ required: false }}
            label={"Address (Line 2)"}
            feature={"profile"}
            inValidMessage={""}
          />
          <CountryAndProvince
            country={companyInfo?.country ? companyInfo.country : ""}
            province={companyInfo?.province ? companyInfo.province : ""}
            width="528px"
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"city"}
            rules={{ required: true }}
            label={"City"}
            feature={"profile"}
            inValidMessage={"City is required"}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"postalCode"}
            rules={{ required: true }}
            label={"Postal / Zip Code"}
            feature={"profile"}
            inValidMessage={"Postal / Zip Code is required"}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
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
                control={control}
                register={register}
                name={"mail_address1"}
                rules={{ required: true }}
                label={"Address (Line 1)"}
                feature={"profile"}
                inValidMessage={"Address is required"}
              />
              <CustomOutlinedInput
                control={control}
                register={register}
                name={"mail_address2"}
                rules={{ required: false }}
                label={"Address (Line 2)"}
                feature={"profile"}
                inValidMessage={""}
              />
              <CountryAndProvince
                country={companyInfo?.country ? companyInfo.country : ""}
                province={companyInfo?.province ? companyInfo.province : ""}
                width="528px"
              />
              <CustomOutlinedInput
                control={control}
                register={register}
                name={"mail_city"}
                rules={{ required: true }}
                label={"City"}
                feature={"profile"}
                inValidMessage={"City is required"}
              />
              <CustomOutlinedInput
                control={control}
                register={register}
                name={"mail_postalCode"}
                rules={{ required: true }}
                label={"Postal / Zip Code"}
                feature={"profile"}
                inValidMessage={"Postal / Zip Code is required"}
              />
            </>
          ) : null}

          <Typography variant="h2" gutterBottom>
            Company Contact Details
          </Typography>

          <CustomOutlinedInput
            control={control}
            register={register}
            name={"email"}
            rules={{ required: false }}
            label={"Email"}
            feature={"profile"}
            inValidMessage={""}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"phone"}
            rules={{ required: true }}
            label={"Phone Number"}
            feature={"profile"}
            inValidMessage={"Phone Number is required"}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"fax"}
            rules={{ required: false }}
            label={"Fax"}
            feature={"profile"}
            inValidMessage={""}
          />

          <Typography variant="h2" gutterBottom>
            Company Primary Contact
          </Typography>

          <InfoBcGovBanner description="The Company Primary Contact will be contacted for all onRouteBC client profile queries." />

          <CustomOutlinedInput
            control={control}
            register={register}
            name={"firstName"}
            rules={{ required: true }}
            label={"First Name"}
            feature={"profile"}
            inValidMessage={"First Name is required"}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"lastName"}
            rules={{ required: true }}
            label={"Last Name"}
            feature={"profile"}
            inValidMessage={"Last Name is required"}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"primaryEmail"}
            rules={{ required: true }}
            label={"Email"}
            feature={"profile"}
            inValidMessage={"Email is required"}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"primaryPhone"}
            rules={{ required: true }}
            label={"Primary Phone"}
            feature={"profile"}
            inValidMessage={"Primary Phone is required"}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"alternatePhone"}
            rules={{ required: false }}
            label={"Alternate Phone"}
            feature={"profile"}
            inValidMessage={""}
          />
          <CountryAndProvince
            country={
              companyInfo?.primaryCountry ? companyInfo.primaryCountry : ""
            }
            province={
              companyInfo?.primaryProvince ? companyInfo.primaryProvince : ""
            }
            width="528px"
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"primaryCity"}
            rules={{ required: true }}
            label={"City"}
            feature={"profile"}
            inValidMessage={"City is required"}
          />
        </FormProvider>
        <div className="mp-form-submit-container">
          <Button
            key="update-company-info-button"
            aria-label="Update Company Info"
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
