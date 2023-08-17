import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Banner } from "../../../common/components/dashboard/Banner";
import "../../../common/components/dashboard/Dashboard.scss";
import { DATE_FORMATS, toLocal } from "../../../common/helpers/formatDate";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { getCompanyUserByUserGUID } from "../apiManager/manageProfileAPI";
import { EditUserForm } from "../components/forms/userManagement/EditUser";
import { BCEID_PROFILE_TABS } from "../types/manageProfile.d";
import { Controller, FormProvider, useForm } from "react-hook-form";
import UserGroupsAndPermissionsModal from "../components/user-management/UserGroupsAndPermissionsModal";
import { requiredMessage } from "../../../common/helpers/validationMessages";
import { BCeIDAuthGroup, ReadCompanyUser } from "../types/userManagement";
import { CustomInputHTMLAttributes } from "../../../common/types/formElements";
import { formatPhoneNumber } from "../../../common/components/form/subFormComponents/PhoneNumberInput";

/**
 * The edit user page for the BCeID org admin
 */
export const EditUserDashboard = React.memo(() => {
  const navigate = useNavigate();
  const { userGUID } = useParams();

  const { data: userInfo, isLoading } = useQuery(
    ["userByuserGUID", userGUID],
    () => getCompanyUserByUserGUID(userGUID as string),
    { retry: false, enabled: true, staleTime: Infinity }
  );

  const formMethods = useForm<ReadCompanyUser>({
    defaultValues: {
      firstName: getDefaultRequiredVal("", userInfo?.firstName),
      lastName: getDefaultRequiredVal("", userInfo?.lastName),
      email: getDefaultRequiredVal("", userInfo?.email),
      phone1: applyWhenNotNullable(formatPhoneNumber, userInfo?.phone1, ""),
      phone1Extension: getDefaultRequiredVal("", userInfo?.phone1Extension),
      phone2: applyWhenNotNullable(formatPhoneNumber, userInfo?.phone2, ""),
      phone2Extension: getDefaultRequiredVal("", userInfo?.phone2Extension),
      fax: applyWhenNotNullable(formatPhoneNumber, userInfo?.fax, ""),
      countryCode: getDefaultRequiredVal("", userInfo?.countryCode),
      provinceCode: getDefaultRequiredVal("", userInfo?.provinceCode),
      city: getDefaultRequiredVal("", userInfo?.city),
      userAuthGroup: BCeIDAuthGroup.ORGADMIN,
    },
  });

  

  const [isUserGroupsModalOpen, setIsUserGroupsModalOpen] =
    useState<boolean>(false);

  const onClickBreadcrumb = () => {
    navigate("../", {
      state: {
        selectedTab: BCEID_PROFILE_TABS.USER_MANAGEMENT_ORGADMIN,
      },
    });
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <Box
          className="layout-box"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Banner
            bannerText={`Edit User: ${userInfo?.firstName} ${" "} ${
              userInfo?.lastName
            }`}
            bannerSubtext={
              <div>
                <strong>Date Created:</strong>
                &nbsp;
                {applyWhenNotNullable(
                  (dateTimeStr: string) =>
                    toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                  userInfo?.createdDateTime,
                  ""
                )}
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <strong>Last Updated:</strong>&nbsp;{" "}
                {getDefaultRequiredVal(
                  "",
                  applyWhenNotNullable(
                    (dateTimeStr: string) =>
                      toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                    userInfo?.updatedDateTime
                  ),
                  applyWhenNotNullable(
                    (dateTimeStr: string) =>
                      toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                    userInfo?.createdDateTime,
                    ""
                  )
                )}
              </div>
            }
            extendHeight={true}
          />
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
            onClick={onClickBreadcrumb}
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
            onClick={onClickBreadcrumb}
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
          <Typography>Edit User</Typography>
        </Box>

        <Box
          className="layout-box"
          sx={{
            // display: "flex",
            paddingTop: "24px",
            backgroundColor: BC_COLOURS.white,
          }}
        >
          <Stack>
            <Stack direction="row">
              <Typography
                variant={"h2"}
                sx={{
                  marginRight: "200px",
                  marginTop: "0px",
                  paddingTop: "0px",
                }}
              >
                User Details
              </Typography>
              {!isLoading && <EditUserForm userInfo={userInfo} />}
            </Stack>
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
                  render={({ field, fieldState: { invalid } }) => {
                    return (
                      <>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            value={field.value}
                            aria-labelledby="radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value={BCeIDAuthGroup.ORGADMIN}
                              control={
                                <Radio
                                  key={`radio-bceid-administrator`}
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
                                  key={`radio-bceid-permit-applicant`}
                                  inputProps={
                                    {
                                      "data-testid": "save-vehicle-no",
                                    } as CustomInputHTMLAttributes
                                  }
                                />
                              }
                              label="Permit Applicant"
                            />
                          </RadioGroup>
                          {invalid && (
                            <FormHelperText>
                              You must assign a user group
                            </FormHelperText>
                          )}
                        </FormControl>
                      </>
                    );
                  }}
                ></Controller>
              </Stack>
            </Stack>
          </Stack>

          <Divider />
        </Box>
        <UserGroupsAndPermissionsModal
          isOpen={isUserGroupsModalOpen}
          onClickClose={() => setIsUserGroupsModalOpen(() => false)}
        />
      </FormProvider>
      {/* <Divider variant="fullWidth" /> */}
    </>
  );
});

EditUserDashboard.displayName = "EditUserDashboard";
