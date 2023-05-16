import { memo } from "react";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";

import "./MyInfoForm.scss";
import { UserInformation } from "../../../types/manageProfile";
import { updateMyInfo } from "../../../apiManager/manageProfileAPI";
import { formatPhoneNumber } from "../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { CountryAndProvince } from "../../../../../common/components/form/CountryAndProvince";
import { getDefaultRequiredVal, applyWhenNotNullable } from "../../../../../common/helpers/util";

export const MyInfoForm = memo(({
  myInfo,
  setIsEditing,
}: {
  myInfo?: UserInformation;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const formMethods = useForm<UserInformation>({
    defaultValues: {
      firstName: getDefaultRequiredVal("", myInfo?.firstName),
      lastName: getDefaultRequiredVal("", myInfo?.lastName),
      email: getDefaultRequiredVal("", myInfo?.email),
      phone1: applyWhenNotNullable(formatPhoneNumber, myInfo?.phone1, ""),
      phone1Extension: getDefaultRequiredVal("", myInfo?.phone1Extension),
      phone2: applyWhenNotNullable(formatPhoneNumber, myInfo?.phone2, ""),
      phone2Extension: getDefaultRequiredVal("", myInfo?.phone2Extension),
      fax: applyWhenNotNullable(formatPhoneNumber, myInfo?.fax, ""),
      countryCode: getDefaultRequiredVal("", myInfo?.countryCode),
      provinceCode: getDefaultRequiredVal("", myInfo?.provinceCode),
      city: getDefaultRequiredVal("", myInfo?.city),
      userAuthGroup: getDefaultRequiredVal("", myInfo?.userAuthGroup),
    },
  });

  const { handleSubmit } = formMethods;

  const addMyInfoMutation = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: (response) => {
      if (response.status === 200) {
        queryClient.invalidateQueries(["myInfo"]);
        setIsEditing(false);
      }
    },
  });

  const onUpdateMyInfo = (data: FieldValues) => {
    addMyInfoMutation.mutate({
      myInfo: data as UserInformation,
    });
  };

  const FEATURE = "my-info-form";

  return (
    <div className="my-info-form">
      <FormProvider {...formMethods}>
        <CustomFormComponent
          type="input"
          feature={FEATURE}
          options={{
            name: "firstName",
            rules: {
              required: { value: true, message: "First name is required" },
              validate: (firstName: string) =>
                (firstName.length >= 1 && firstName.length <= 100)
                  || "First name length must be between 1-100 characters",
            },
            label: "First Name",
          }}
          className="my-info-form__input"
        />
        <CustomFormComponent
          type="input"
          feature={FEATURE}
          options={{
            name: "lastName",
            rules: {
              required: { value: true, message: "Last name is required" },
              validate: (lastName: string) =>
                (lastName.length >= 1 && lastName.length <= 100)
                  || "Last name length must be between 1-100 characters",
            },
            label: "Last Name",
          }}
          className="my-info-form__input"
        />
        <CustomFormComponent
          type="input"
          feature={FEATURE}
          options={{
            name: "email",
            rules: {
              required: { value: true, message: "Email is required" },
              validate: (email: string) =>
                isEmail(email) || "Incorrect email format",
            },
            label: "Email",
          }}
          className="my-info-form__input"
        />
        <div className="side-by-side-inputs">
          <CustomFormComponent
            type="phone"
            feature={FEATURE}
            options={{
              name: "phone1",
              rules: {
                required: { value: true, message: "Primary phone is required" },
                validate: (phone: string) =>
                  (phone.length >= 10 && phone.length <= 20)
                    || "Phone length must be between 10-20 characters",
              },
              label: "Primary Phone",
            }}
            className="my-info-form__input my-info-form__input--left"
          />
          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "phone1Extension",
              rules: { 
                required: false,
                validate: (ext?: string) =>
                  (ext == null || ext === "")
                    || (ext != null && ext !== "" && ext.length <= 5)
                    || "Extension length must be less than 5 characters",
              },
              label: "Ext",
            }}
            className="my-info-form__input my-info-form__input--right"
          />
        </div>
        <div className="side-by-side-inputs">
          <CustomFormComponent
            type="phone"
            feature={FEATURE}
            options={{
              name: "phone2",
              rules: { 
                required: false,
                validate: (phone2?: string) =>
                  (phone2 == null || phone2 === "")
                    || (phone2 != null && phone2 !== "" && phone2.length >= 10 && phone2.length <= 20)
                    || "Alternate phone length must be between 10-20 characters",
              },
              label: "Alternate Phone",
            }}
            className="my-info-form__input my-info-form__input--left"
          />
          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "phone2Extension",
              rules: { 
                required: false,
                validate: (ext?: string) =>
                  (ext == null || ext === "")
                    || (ext != null && ext !== "" && ext.length <= 5)
                    || "Extension length must be less than 5 characters",
              },
              label: "Ext",
            }}
            className="my-info-form__input my-info-form__input--right"
          />
        </div>
        <CustomFormComponent
          type="phone"
          feature={FEATURE}
          options={{
            name: "fax",
            rules: { 
              required: false,
              validate: (fax?: string) =>
                (fax == null || fax === "")
                  || (fax != null && fax !== "" && fax.length >= 10 && fax.length <= 20)
                  || "Fax length must be between 10-20 characters",
            },
            label: "Fax",
          }}
          className="my-info-form__input my-info-form__input--left"
        />
        <CountryAndProvince
          feature={FEATURE}
          countryField="countryCode"
          provinceField="provinceCode"
          width="100%"
        />
        <CustomFormComponent
          type="input"
          feature={FEATURE}
          options={{
            name: "city",
            rules: {
              required: { value: true, message: "City is required" },
              validate: (city: string) =>
                (city.length >= 1 && city.length <= 100)
                  || "City length must be between 1-100 characters",
            },
            label: "City",
          }}
          className="my-info-form__input"
        />
      </FormProvider>
      <div className="my-info-form__submission">
        <Button
          key="update-my-info-cancel-button"
          className="submit-btn submit-btn--cancel"
          aria-label="Cancel Update"
          variant="contained"
          color="tertiary"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button
          key="update-my-info-button"
          className="submit-btn"
          aria-label="Update My Info"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onUpdateMyInfo)}
        >
          Save
        </Button>
      </div>
    </div>
  );
});

MyInfoForm.displayName = "MyInfoForm";
