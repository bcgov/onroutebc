import { Alert, Box, Button, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { Banner } from "../../common/components/dashboard/Banner";
import { ErrorFallback } from "../../common/pages/ErrorFallback";
import { ReusableUserInfoForm } from "../manageProfile/components/forms/common/ReusableUserInfoForm";
import { UserInformation } from "../manageProfile/types/manageProfile";
import { BCeIDAuthGroup } from "../manageProfile/types/userManagement.d";
import { createMyOnRouteBCUserProfile } from "../manageProfile/apiManager/manageProfileAPI";
import { useMutation } from "@tanstack/react-query";
import OnRouteBCContext from "../../common/authentication/OnRouteBCContext";
import {
  useUserContext,
  useUserRolesByCompanyId,
} from "../manageProfile/apiManager/hooks";
import { getDefaultRequiredVal } from "../../common/helpers/util";
import { SnackBarContext } from "../../App";
import { OnRouteBCProfileCreated } from "./pages/OnRouteBCProfileCreated";

export const UserInfoWizard = React.memo(() => {
  const formMethods = useForm<
    Omit<UserInformation, "statusCode" | "userName" | "userGUID">
  >({
    defaultValues: {
      // Remove this userAuthGroup once backend integrates the auth group.
      userAuthGroup: BCeIDAuthGroup.CVCLIENT as string,
      firstName: "",
      lastName: "",
      email: "",
      phone1: "",
      phone1Extension: "",
      phone2: "",
      phone2Extension: "",
      fax: "",
      countryCode: "",
      provinceCode: "",
      city: "",
    },
  });

  const { setUserDetails } = useContext(OnRouteBCContext);
  const { setSnackBar } = useContext(SnackBarContext);
  const [isProfileCreated, setIsProfileCreated] = useState<boolean>(false);

  const createProfileQuery = useMutation({
    mutationFn: createMyOnRouteBCUserProfile,
    onSuccess: async (response) => {
      if (response.status === 201) {
        const responseBody = response.data as UserInformation;
        const userDetails = {
          firstName: responseBody.firstName,
          lastName: responseBody.lastName,
          userName: responseBody.userName,
          phone1: responseBody.phone1,
          phone1Extension: responseBody.phone1Extension,
          phone2: responseBody.phone2,
          phone2Extension: responseBody.phone2Extension,
          email: responseBody.email,
          fax: responseBody.fax,
          userAuthGroup: responseBody.userAuthGroup,
        };
        setIsProfileCreated(() => true);
        // setUserDetails?.(() => userDetails);
        useUserContext();
        useUserRolesByCompanyId();
      } else if (response.status === 400) {
        const { error } = response.data;
        const firstErrMsg = getDefaultRequiredVal([], error);
        if (firstErrMsg[0]) {
          setSnackBar({
            message: firstErrMsg,
            showSnackbar: true,
            setShowSnackbar: () => true,
            alertType: "error",
          });
        }
      }
    },
  });

  /**
   * Creates the user profile on click of finish.
   * @param data The form data
   */
  const onClickFinish = (data: FieldValues) => {
    createProfileQuery.mutate({
      myInfo: data as Omit<
        UserInformation,
        "statusCode" | "userName" | "userGUID"
      >,
    });
  };

  const { handleSubmit } = formMethods;

  if (isProfileCreated) {
    return (
      <>
        <OnRouteBCProfileCreated />
      </>
    );
  }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FormProvider {...formMethods}>
        <Box
          className="layout-box"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Banner bannerText="Create a new onRouteBC Profile" />
          <br></br>
        </Box>
        <div
          className="tabpanel-container create-profile-steps"
          role="profile-steps"
          id={`profile-steps`}
          aria-labelledby={`profile-steps`}
        >
          <div className="create-profile-steps__create-profile">
            <div className="create-profile-section create-profile-section--info">
              <Alert severity="info">
                <Typography>
                  <strong>
                    Please note, unless stated otherwise, all fields are
                    mandatory.
                  </strong>
                </Typography>
              </Alert>
            </div>
            <ReusableUserInfoForm feature="my-info-wizard" />
            <div className="create-profile-section create-profile-section--nav">
              <Button
                onClick={handleSubmit(onClickFinish)}
                variant="contained"
                className="proceed-btn proceed-btn--finish"
              >
                Finish
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </ErrorBoundary>
  );
});

UserInfoWizard.displayName = "UserInfoWizard";
