import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Divider,
  Link,
  Typography
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext, useState } from "react";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../../../App";
import { Banner } from "../../../common/components/dashboard/Banner";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../common/helpers/validationMessages";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { addUserToCompany } from "../apiManager/manageProfileAPI";
import { UserAuthRadioGroup } from "../components/forms/userManagement/UserAuthRadioGroup";
import UserGroupsAndPermissionsModal from "../components/user-management/UserGroupsAndPermissionsModal";
import { BCEID_PROFILE_TABS } from "../types/manageProfile.d";
import { BCeIDAddUserRequest, BCeIDAuthGroup } from "../types/userManagement.d";
import "./AddUserDashboard.scss";

/**
 * BCeID User - Add User Page.
 */
export const AddUserDashboard = React.memo(() => {
  const navigate = useNavigate();
  const [isUserGroupsModalOpen, setIsUserGroupsModalOpen] =
    useState<boolean>(false);

  const formMethods = useForm<BCeIDAddUserRequest>({
    defaultValues: {
      userAuthGroup: BCeIDAuthGroup.CVCLIENT,
    },
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const { setSnackBar } = useContext(SnackBarContext);

  const onClickBreadCrumb = () => {
    navigate("/manage-profiles", {
      state: {
        selectedTab: BCEID_PROFILE_TABS.USER_MANAGEMENT_ORGADMIN,
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
      if (response?.status === 400) {
        setSnackBar({
          message: "Cannot add user; Check if the user already has been added",
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
        navigate("/manage-profiles", {
          state: {
            selectedTab: BCEID_PROFILE_TABS.USER_MANAGEMENT_ORGADMIN,
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
    <>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText="Add User" extendHeight={true} />
      </Box>
      <Box
        className="layout-box"
        sx={{
          display: "flex",
          height: "60px",
          alignItems: "center",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Typography
          onClick={onClickBreadCrumb}
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
        >
          Profile
        </Typography>
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ marginLeft: "8px", marginRight: "8px" }}
        />
        <Typography
          onClick={onClickBreadCrumb}
          style={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          User Management
        </Typography>
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ marginLeft: "8px", marginRight: "8px" }}
        />
        <Typography>Add User</Typography>
      </Box>

      <FormProvider {...formMethods}>
        <Box
          className="layout-box"
          sx={{
            display: "flex",
            paddingTop: "24px",
            backgroundColor: BC_COLOURS.white,
          }}
        >
          <Stack direction="row" spacing={16}>
            <Stack>
              <Typography
                variant={"h2"}
                sx={{
                  marginRight: "200px",
                  marginTop: "0px",
                  paddingTop: "0px",
                  borderBottom: "0px",
                }}
              >
                User ID
              </Typography>
            </Stack>
            <CustomFormComponent
              type="input"
              feature="add-user"
              className="margin-top-zero"
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
        <Box
          className="layout-box"
          sx={{
            display: "flex",
            paddingTop: "24px",
            backgroundColor: BC_COLOURS.white,
          }}
        >
          <Stack direction="row">
            <Stack>
              <Typography
                variant={"h2"}
                sx={{
                  marginRight: "200px",
                  marginTop: "0px",
                  paddingTop: "0px",
                  borderBottom: "0px",
                }}
              >
                Assign User Group
              </Typography>
              <Typography
                variant={"h2"}
                sx={{
                  marginRight: "200px",
                  marginTop: "0px",
                  paddingTop: "0px",
                  borderBottom: "0px",
                }}
              >
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setIsUserGroupsModalOpen(() => true)}
                >
                  User Groups and Permissions
                </Link>
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Controller
                name="userAuthGroup"
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
    </>
  );
});

AddUserDashboard.displayName = "AddVehicleDashboard";
