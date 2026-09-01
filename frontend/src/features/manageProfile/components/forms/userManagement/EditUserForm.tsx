import { memo, useContext, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { CustomActionLink } from "../../../../../common/components/links/CustomActionLink";
import { SnackBarContext } from "../../../../../App";
import { requiredMessage } from "../../../../../common/helpers/validationMessages";
import { ERROR_ROUTES, PROFILE_ROUTES } from "../../../../../routes/constants";
import { updateUserInfo } from "../../../apiManager/manageProfileAPI";
import { BCeID_USER_ROLE } from "../../../../../common/authentication/types";
import UserGroupsAndPermissionsModal from "../../user-management/UserGroupsAndPermissionsModal";
import { ReusableUserInfoForm } from "../common/ReusableUserInfoForm";
import "./EditUserForm.scss";
import { UserAuthRadioGroup } from "./UserAuthRadioGroup";
import { getFormattedPhoneNumber } from "../../../../../common/helpers/phone/getFormattedPhoneNumber";
import {
  PROFILE_TABS,
  ReadUserInformationResponse,
  UserInfoRequest,
} from "../../../types/manageProfile.d";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";
import { ORBC_FORM_FEATURES } from "../../../../../common/types/common";

const FEATURE = ORBC_FORM_FEATURES.USER_INFORMATION;

/**
 * Edit User form for User Management.
 */
export const EditUserForm = memo(
  ({ userInfo }: { userInfo?: ReadUserInformationResponse }) => {
    const navigate = useNavigate();

    const { setSnackBar } = useContext(SnackBarContext);

    const formMethods = useForm<UserInfoRequest>({
      defaultValues: {
        firstName: getDefaultRequiredVal("", userInfo?.firstName),
        lastName: getDefaultRequiredVal("", userInfo?.lastName),
        email: getDefaultRequiredVal("", userInfo?.email),
        phone1: applyWhenNotNullable(
          getFormattedPhoneNumber,
          userInfo?.phone1,
          "",
        ),
        phone1Extension: getDefaultRequiredVal("", userInfo?.phone1Extension),
        phone2: applyWhenNotNullable(
          getFormattedPhoneNumber,
          userInfo?.phone2,
          "",
        ),
        phone2Extension: getDefaultRequiredVal("", userInfo?.phone2Extension),
        countryCode: getDefaultRequiredVal("", userInfo?.countryCode),
        provinceCode: getDefaultRequiredVal("", userInfo?.provinceCode),
        city: getDefaultRequiredVal("", userInfo?.city),
        userRole: getDefaultRequiredVal(
          BCeID_USER_ROLE.COMPANY_ADMINISTRATOR,
          userInfo?.userRole,
        ),
      },
    });

    const { handleSubmit } = formMethods;

    const [isUserGroupsModalOpen, setIsUserGroupsModalOpen] =
      useState<boolean>(false);

    const onClickBreadcrumb = () => {
      navigate(PROFILE_ROUTES.MANAGE, {
        state: {
          selectedTab: PROFILE_TABS.USER_MANAGEMENT,
        },
      });
    };

    const updateUserInfoMutation = useMutation({
      mutationFn: updateUserInfo,
      onError: (error: AxiosError) => {
        navigate(ERROR_ROUTES.UNEXPECTED, {
          state: { correlationId: error.response?.headers["x-correlation-id"] },
        });
      },
      onSuccess: (response) => {
        if (response.status === 200) {
          setSnackBar({
            alertType: "success",
            message: "Changes Saved",
            showSnackbar: true,
            setShowSnackbar: () => true,
          });

          navigate(PROFILE_ROUTES.MANAGE, {
            state: {
              selectedTab: PROFILE_TABS.USER_MANAGEMENT,
            },
          });
        } else {
          navigate(ERROR_ROUTES.UNEXPECTED, {
            state: { correlationId: response.headers["x-correlation-id"] },
          });
        }
      },
    });

    const onUpdateUserInfo = (data: UserInfoRequest) => {
      updateUserInfoMutation.mutate({
        userInfo: data,
        userGUID: userInfo?.userGUID as string,
      });
    };

    return (
      <FormProvider {...formMethods}>
        <div className="edit-user-form">
          <div className="edit-user-form__section">
            <ReusableUserInfoForm feature={FEATURE} />

            <div className="edit-user-form__section">
              <div className="section__assign-user">
                <Typography variant={"h2"}>Assign User Group</Typography>
                <Typography variant={"h2"}>
                  <CustomActionLink
                    onClick={() => setIsUserGroupsModalOpen(() => true)}
                  >
                    User Groups and Permissions
                  </CustomActionLink>
                </Typography>
              </div>
            </div>

            <div>
              <Controller
                name="userRole"
                rules={{
                  required: { value: true, message: requiredMessage() },
                }}
                render={({ field, fieldState }) => (
                  <UserAuthRadioGroup field={field} fieldState={fieldState} />
                )}
              ></Controller>

              <div className="section__actions">
                <Button
                  key="update-my-info-cancel-button"
                  aria-label="Cancel Update"
                  variant="contained"
                  color="tertiary"
                  onClick={onClickBreadcrumb}
                >
                  Cancel
                </Button>

                <Button
                  key="update-my-info-button"
                  aria-label="Update My Info"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onUpdateUserInfo)}
                >
                  Save
                </Button>
              </div>
            </div>

            <br />

            <UserGroupsAndPermissionsModal
              isOpen={isUserGroupsModalOpen}
              onClickClose={() => setIsUserGroupsModalOpen(() => false)}
            />
          </div>
        </div>
      </FormProvider>
    );
  },
);

EditUserForm.displayName = "EditUserForm";
