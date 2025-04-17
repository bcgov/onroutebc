import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext, useState } from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, Typography, Stack } from "@mui/material";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";

import "./AddUserDashboard.scss";
import { SnackBarContext } from "../../../App";
import { Banner } from "../../../common/components/dashboard/components/banner/Banner";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../common/helpers/validationMessages";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { addUserToCompany } from "../apiManager/manageProfileAPI";
import { UserAuthRadioGroup } from "../components/forms/userManagement/UserAuthRadioGroup";
import UserGroupsAndPermissionsModal from "../components/user-management/UserGroupsAndPermissionsModal";
import { PROFILE_TABS, BCeIDAddUserRequest } from "../types/manageProfile.d";
import { PROFILE_ROUTES } from "../../../routes/constants";
import { CustomActionLink } from "../../../common/components/links/CustomActionLink";
import { BCeID_USER_ROLE } from "../../../common/authentication/types";
import { ORBC_FORM_FEATURES } from "../../../common/types/common";

/**
 * BCeID User - Add User Page.
 */
export const AddUserDashboard = React.memo(() => {
  const navigate = useNavigate();
  const [isUserGroupsModalOpen, setIsUserGroupsModalOpen] =
    useState<boolean>(false);

  const formMethods = useForm<BCeIDAddUserRequest>({
    defaultValues: {
      userRole: BCeID_USER_ROLE.PERMIT_APPLICANT,
    },
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const { setSnackBar } = useContext(SnackBarContext);

  const onClickBreadCrumb = () => {
    navigate(PROFILE_ROUTES.MANAGE, {
      state: {
        selectedTab: PROFILE_TABS.USER_MANAGEMENT,
      },
    });
  };

  /**
   * The add user mutation hook.
   */
  const addUserMutation = useMutation({
    mutationFn: addUserToCompany,
    onError: async (error) => {
      const { response } = error as AxiosError;
      if (response?.status === 422) {
        const { error } = response.data as {
          message: string;
          status: number;
          error: [
            {
              message: string;
              errorCode: string;
            },
          ];
        };
        let messageToDisplay = "An unexpected error occurred.";
        if (error[0].errorCode === "USER_ALREADY_EXISTS") {
          messageToDisplay =
            "Cannot add user; Check if the user already has been added";
        } else if (error[0].errorCode === "FIRST_USER_ADMIN") {
          messageToDisplay = "First user must be an administrator";
        }
        setSnackBar({
          message: messageToDisplay,
          showSnackbar: true,
          setShowSnackbar: () => true,
          alertType: "error",
        });
      } else {
        setSnackBar({
          message: "An unexpected error occurred.",
          showSnackbar: true,
          setShowSnackbar: () => true,
          alertType: "error",
        });
      }
    },
    onSuccess: async (response) => {
      if (response.status === 201) {
        setSnackBar({
          alertType: "success",
          message: "User Added",
          showSnackbar: true,
          setShowSnackbar: () => true,
        });
        navigate(PROFILE_ROUTES.MANAGE, {
          state: {
            selectedTab: PROFILE_TABS.USER_MANAGEMENT,
          },
        });
      } else {
        setSnackBar({
          message: "An unexpected error occurred.",
          showSnackbar: true,
          setShowSnackbar: () => true,
          alertType: "error",
        });
      }
    },
  });

  /**
   * Adds a new user to the company.
   */
  const onClickAddUser = (data: FieldValues) => {
    addUserMutation.mutate(data as BCeIDAddUserRequest);
  };

  return (
    <div className="dashboard-page dashboard-page--add-user">
      <Box className="dashboard-page__banner layout-box">
        <Banner bannerText="Add User" />
      </Box>

      <Box className="dashboard-page__breadcrumb layout-box">
        <Typography
          className="breadcrumb-link breadcrumb-link--parent"
          onClick={onClickBreadCrumb}
        >
          Profile
        </Typography>

        <FontAwesomeIcon className="breadcrumb-icon" icon={faChevronRight} />

        <Typography
          className="breadcrumb-link breadcrumb-link--parent"
          onClick={onClickBreadCrumb}
          style={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Add / Manage Users
        </Typography>

        <FontAwesomeIcon className="breadcrumb-icon" icon={faChevronRight} />

        <Typography>Add User</Typography>
      </Box>

      <FormProvider {...formMethods}>
        <Box className="dashboard-page__form dashboard-page__form--user-id layout-box">
          <Stack className="user-id" direction="row" spacing={16}>
            <Stack>
              <Typography className="user-id__label" variant={"h2"}>
                User ID
              </Typography>
            </Stack>

            <CustomFormComponent
              type="input"
              feature={ORBC_FORM_FEATURES.ADD_USER}
              className="user-id__input"
              options={{
                name: "userName",
                rules: {
                  required: { value: true, message: requiredMessage() },
                  minLength: 3,
                },
                label: "BCeID User ID",
              }}
            />
          </Stack>
        </Box>

        <Divider variant="middle" />

        <Box className="dashboard-page__form dashboard-page__form--user-group layout-box">
          <Stack direction="row">
            <Stack>
              <Typography variant={"h2"}>Assign User Group</Typography>

              <Typography variant={"h2"}>
                <CustomActionLink
                  onClick={() => setIsUserGroupsModalOpen(() => true)}
                >
                  User Groups and Permissions
                </CustomActionLink>
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Controller
                name="userRole"
                rules={{
                  required: { value: true, message: requiredMessage() },
                }}
                render={({ field, fieldState }) => (
                  <UserAuthRadioGroup field={field} fieldState={fieldState} />
                )}
              ></Controller>
              <Stack direction="row">
                <Button
                  key="cancel-add-user-button"
                  aria-label="Cancel Add User"
                  variant="contained"
                  color="secondary"
                  onClick={onClickBreadCrumb}
                  sx={{ marginRight: "32px" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit(onClickAddUser)}
                >
                  Add User
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </FormProvider>

      <UserGroupsAndPermissionsModal
        isOpen={isUserGroupsModalOpen}
        onClickClose={() => setIsUserGroupsModalOpen(() => false)}
      />
    </div>
  );
});

AddUserDashboard.displayName = "AddVehicleDashboard";
