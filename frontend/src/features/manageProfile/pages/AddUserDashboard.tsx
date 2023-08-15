import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Typography,
  Divider,
  Link,
  OutlinedInput,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import React, { useContext, useState } from "react";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
// import "../../../../common/components/dashboard/Dashboard.scss";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { Banner } from "../../../common/components/dashboard/Banner";
import UserGroupsAndPermissionsModal from "../components/user-management/UserGroupsAndPermissionsModal";
import { CustomOutlinedInput } from "../../../common/components/form/subFormComponents/CustomOutlinedInput";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../common/helpers/validationMessages";
import { FormProvider, useForm } from "react-hook-form";
import { BCeIDAddUserRequest, BCeIDAuthGroup } from "../types/userManagement.d";
import "./AddUserDashboard.scss";
import { CustomInputHTMLAttributes } from "../../../common/types/formElements";
import { useMutation } from "@tanstack/react-query";
import { addUserToCompany } from "../apiManager/manageProfileAPI";
import { SnackBarContext } from "../../../App";

/**
 * BCeID User - Add User Page.
 */
export const AddUserDashboard = React.memo(() => {
  const navigate = useNavigate();
  const [isUserGroupsModalOpen, setIsUserGroupsModalOpen] =
    useState<boolean>(false);

  const formMethods = useForm<BCeIDAddUserRequest>({
    reValidateMode: "onBlur",
  });

  const { setSnackBar } = useContext(SnackBarContext);

  const onClickBreadCrumb = () => {
    navigate("../");
  };

  const addUserMutation = useMutation({
    mutationFn: addUserToCompany,
    onSuccess: async (response) => {
      // if (hasValidationErrors(response.status)) {
      //   const { error } = response.data;
      //   const firstErrMsg = getFirstValidationError(getDefaultRequiredVal([], error));
      //   if (firstErrMsg) {
      //     setSnackBar({
      //       message: firstErrMsg,
      //       showSnackbar: true,
      //       setShowSnackbar: () => true,
      //       alertType: "error",
      //     });
      //   }
      // }
      setSnackBar({
        alertType: "success",
        message: "Changes Saved",
        showSnackbar: true,
        setShowSnackbar: () => true,
        anchorOrigin: {
          horizontal: 'center'
        }
      });
      navigate("../");
    },
  });

  /**
   *
   */
  const onClickAddUser = () => {
    console.log(formMethods.getValues());
    addUserMutation.mutate(formMethods.getValues());
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
              <br />
            </Stack>

            <CustomFormComponent
              type="input"
              feature="add-user"
              className="margin-top-zero"
              options={{
                name: "userName",
                rules: {
                  required: { value: true, message: requiredMessage() },
                },
                label: "BCeID User ID",
              }}
            />
          </Stack>

          {/* Form Component */}
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
              <RadioGroup
                aria-labelledby="radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(x) => {
                  formMethods.setValue(
                    "userAuthGroup",
                    x.target.value as BCeIDAuthGroup
                  );
                  console.log(formMethods.getValues());
                }}
              >
                <FormControlLabel
                  value={BCeIDAuthGroup.ORGADMIN}
                  control={
                    <Radio
                      key={`radio-save-vehicle-yes`}
                      inputProps={
                        {
                          "data-testid": "save-vehicle-yes",
                        } as CustomInputHTMLAttributes
                      }
                    />
                  }
                  label="Administrator"
                />
                <FormControlLabel
                  value={BCeIDAuthGroup.CVCLIENT}
                  control={
                    <Radio
                      key={`radio-save-vehicle-no`}
                      inputProps={
                        {
                          "data-testid": "save-vehicle-no",
                        } as CustomInputHTMLAttributes
                      }
                    />
                  }
                  label="Permit Applicant"
                />
                {/* <Box sx={{ display: "flex" }}>
                
              </Box> */}
              </RadioGroup>

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
                <Button variant="contained" onClick={onClickAddUser}>
                  Add User
                </Button>
              </Stack>
            </Stack>
          </Stack>

          {/* Form Component */}
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
