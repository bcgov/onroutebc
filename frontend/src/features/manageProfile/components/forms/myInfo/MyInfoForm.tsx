import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

import { formatPhoneNumber } from "../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { updateMyInfo } from "../../../apiManager/manageProfileAPI";
import { UserInformation } from "../../../types/manageProfile";
import { ReusableUserInfoForm } from "../common/ReusableUserInfoForm";
import "./MyInfoForm.scss";

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
      <ReusableUserInfoForm feature={FEATURE} />
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
