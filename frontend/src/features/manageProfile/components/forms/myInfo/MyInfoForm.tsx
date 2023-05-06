import { memo } from "react";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

import "./MyInfoForm.scss";
import { UserInformation } from "../../../types/manageProfile";
import { updateMyInfo } from "../../../apiManager/manageProfileAPI";
import { formatPhoneNumber } from "../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { CountryAndProvince } from "../../../../../common/components/form/CountryAndProvince";
import { transformNullableStrToStr } from "../../../../../common/helpers/util";


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
      firstName: transformNullableStrToStr(myInfo?.firstName),
      lastName: transformNullableStrToStr(myInfo?.lastName),
      email: transformNullableStrToStr(myInfo?.email),
      phone1: transformNullableStrToStr(myInfo?.phone1, formatPhoneNumber),
      phone1Extension: transformNullableStrToStr(myInfo?.phone1Extension),
      phone2: transformNullableStrToStr(myInfo?.phone2, formatPhoneNumber),
      phone2Extension: transformNullableStrToStr(myInfo?.phone2Extension),
      fax: transformNullableStrToStr(myInfo?.fax, formatPhoneNumber),
      countryCode: transformNullableStrToStr(myInfo?.countryCode),
      provinceCode: transformNullableStrToStr(myInfo?.provinceCode),
      city: transformNullableStrToStr(myInfo?.city),
      userAuthGroup: transformNullableStrToStr(myInfo?.userAuthGroup),
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
              rules: { required: false },
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
              rules: { required: false },
              label: "Alternate Phone",
            }}
            className="my-info-form__input my-info-form__input--left"
          />
          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "phone2Extension",
              rules: { required: false },
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
            rules: { required: false },
            label: "Fax",
          }}
          className="my-info-form__input my-info-form__input--left"
        />
        <CountryAndProvince
          feature={FEATURE}
          countryField="countryCode"
          isCountryRequired={false}
          provinceField="provinceCode"
          isProvinceRequired={false}
          width="100%"
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
