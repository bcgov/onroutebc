import { Button, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import {
  addUserInfo,
  UserInformation,
} from "../../../manageProfile/apiManager/manageProfileAPI";
import { InfoBcGovBanner } from "../../../../common/components/alertBanners/AlertBanners";

import "../forms/CompanyInfoForms.scss";
import { formatPhoneNumber } from "../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import {
  CITY_WIDTH,
  EXT_WIDTH,
  PHONE_WIDTH,
  POSTAL_WIDTH,
} from "../../../../themes/bcGovStyles";

/**
 * The User Information Form contains multiple subs forms including
 * Company Info, Company Contact, Primary Contact, and Mailing Address Forms.
 * This Component contains the logic for React Hook forms and React query
 * for state management and API calls
 */
export const UserInformationForm = memo(
  ({
    userInfo,
    setIsEditing,
  }: {
    userInfo?: UserInformation;
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const queryClient = useQueryClient();

    const formMethods = useForm<UserInformation>({
      defaultValues: {
        firstName: userInfo?.firstName || "",
        lastName: userInfo?.lastName || "",
        phone1: userInfo?.phone1 ? formatPhoneNumber(userInfo?.phone1) : "",
        phone1Extension: userInfo?.phone1Extension || "",
        phone2: userInfo?.phone2 ? formatPhoneNumber(userInfo?.phone2) : "",
        phone2Extension: userInfo?.phone2Extension || "",
        email: userInfo?.email || "",
        city: userInfo?.city || "",
        provinceCode: userInfo?.provinceCode || "",
        countryCode: userInfo?.countryCode || "",
        fax: userInfo?.fax || "",
      },
    });

    const { handleSubmit } = formMethods;

    const addUserInfoQuery = useMutation({
      mutationFn: addUserInfo,
      onSuccess: (response) => {
        console.log(response.status);
        if (response.status === 200) {
          queryClient.invalidateQueries(["companyInfo"]);
          setIsEditing && setIsEditing(false);
        } else {
          // Display Error in the form.
        }
      },
    });

    const onUpdateUserInfo = function (data: FieldValues) {
      const userInfoToBeUpdated = data as UserInformation;
      addUserInfoQuery.mutate({
        companyGUID: "TEST_changeme",
        userInfo: userInfoToBeUpdated,
      });
    };

    const FEATURE = "user-profile";

    return (
      <div className="mp-form-container">
        <FormProvider {...formMethods}>
          <>
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "firstName",
                rules: {
                  required: { value: true, message: "First Name is required" },
                },
                label: "First Name",
              }}
            />
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "lastName",
                rules: {
                  required: { value: true, message: "Last Name is required" },
                },
                label: "Last Name",
              }}
            />
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "email",
                rules: {
                  required: { value: true, message: "Email is required" },
                },
                label: "Email",
              }}
            />

            <div className="mp-side-by-side-container">
              <CustomFormComponent
                type="phone"
                feature={FEATURE}
                options={{
                  name: "phone1",
                  rules: {
                    required: {
                      value: true,
                      message: "Phone Number is required",
                    },
                  },
                  label: "Primary Phone",
                  width: PHONE_WIDTH,
                }}
              />
              <CustomFormComponent
                type="input"
                feature={FEATURE}
                options={{
                  name: "phone1Extension",
                  rules: { required: false },
                  label: "Ext",
                  width: EXT_WIDTH,
                }}
              />
            </div>
            <div className="mp-side-by-side-container">
              <CustomFormComponent
                type="phone"
                feature={FEATURE}
                options={{
                  name: "phone2",
                  rules: { required: false },
                  label: "Alternate Phone",
                  width: PHONE_WIDTH,
                }}
              />
              <CustomFormComponent
                type="input"
                feature={FEATURE}
                options={{
                  name: "phone2Extension",
                  rules: { required: false },
                  label: "Ext",
                  width: EXT_WIDTH,
                }}
              />
            </div>
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "fax",
                rules: { required: false },
                label: "Fax",
                width: PHONE_WIDTH,
              }}
            />
            <CountryAndProvince
              feature={FEATURE}
              countryField="countryCode"
              isCountryRequired={true}
              provinceField="provinceCode"
              isProvinceRequired={true}
            />
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "city",
                rules: {
                  required: { value: true, message: "City is required" },
                },
                label: "City",
                
              }}
            />
          </>
        </FormProvider>
        <div className="mp-form-submit-container">
          <Button
            key="update-company-info-cancel-button"
            aria-label="Cancel Update"
            variant="contained"
            color="tertiary"
            sx={{ marginRight: "40px" }}
            onClick={() => setIsEditing && setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            key="update-company-info-button"
            aria-label="Update Company Info"
            variant="contained"
            color="primary"
            onClick={handleSubmit(onUpdateUserInfo)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
);

UserInformationForm.displayName = "UserInformationForm";
