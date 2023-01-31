import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import {
  getCompanyInfo,
  ICompanyInfo,
  updateCompanyInfo,
} from "../../apiManager/manageProfileAPI";
import { CustomOutlinedInput } from "../../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../../common/components/alertBanners/AlertBanners";
import { BC_TEXT_BOX_BORDER_GREY } from "../../../../themes/bcGovStyles";

//import "./CompanyInfoForms.scss";

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
}

export const CompanyInfoForm = memo(
  ({ companyInfo }: { companyInfo?: ICompanyInfo }) => {
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

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1056px",
          marginTop: "10px",
        }}
      >
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
            inValidMessage={""}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"postalCode"}
            rules={{ required: true }}
            label={"Postal / Zip Code"}
            feature={"profile"}
            inValidMessage={""}
          />

          <h2
            style={{
              paddingTop: "40px",
              paddingBottom: "24px",
              borderBottom: `1px solid ${BC_TEXT_BOX_BORDER_GREY}`,
              display: "inline-block",
            }}
          >
            Company Contact Details
          </h2>

          <CustomOutlinedInput
            control={control}
            register={register}
            name={"email"}
            rules={{ required: false }}
            label={"Email (optional)"}
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
            inValidMessage={""}
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

          <h2
            style={{
              paddingTop: "40px",
              paddingBottom: "24px",
              borderBottom: `1px solid ${BC_TEXT_BOX_BORDER_GREY}`,
              display: "inline-block",
            }}
          >
            Company Primary Contact
          </h2>

          <InfoBcGovBanner description="The Company Primary Contact will be contacted for all onRouteBC client profile queries." />

          <CustomOutlinedInput
            control={control}
            register={register}
            name={"firstName"}
            rules={{ required: true }}
            label={"First Name"}
            feature={"profile"}
            inValidMessage={""}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"lastName"}
            rules={{ required: true }}
            label={"Last Name"}
            feature={"profile"}
            inValidMessage={""}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"primaryEmail"}
            rules={{ required: true }}
            label={"Email"}
            feature={"profile"}
            inValidMessage={""}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"primaryPhone"}
            rules={{ required: true }}
            label={"Primary Phone"}
            feature={"profile"}
            inValidMessage={""}
          />
          <CustomOutlinedInput
            control={control}
            register={register}
            name={"alternatePhone"}
            rules={{ required: false }}
            label={"Alternate Phone (optional)"}
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
            inValidMessage={""}
          />
        </FormProvider>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "30px 0px",
            width: "528px",
          }}
        >
          <Button
            key="update-company-info-button"
            aria-label="Update Company Info"
            variant="contained"
            color="secondary"
            sx={{ marginRight: "40px" }}
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
