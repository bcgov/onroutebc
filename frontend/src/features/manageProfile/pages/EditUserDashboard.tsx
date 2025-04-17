import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./EditUserDashboard.scss";
import { Banner } from "../../../common/components/dashboard/components/banner/Banner";
import { getCompanyUserByUserGUID } from "../apiManager/manageProfileAPI";
import { EditUserForm } from "../components/forms/userManagement/EditUser";
import { PROFILE_TABS } from "../types/manageProfile.d";
import { DATE_FORMATS, toLocal } from "../../../common/helpers/formatDate";
import { PROFILE_ROUTES } from "../../../routes/constants";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";

/**
 * The edit user page for the BCeID org admin
 */
export const EditUserDashboard = React.memo(() => {
  const navigate = useNavigate();
  const { userGUID } = useParams();

  const { data: userInfo, isPending } = useQuery({
    queryKey: ["userByuserGUID", userGUID],
    queryFn: () => getCompanyUserByUserGUID(userGUID as string),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: true,
    gcTime: 0, // Disable saving in cache - Always fetch for latest data.
  });

  const onClickBreadcrumb = () => {
    navigate(PROFILE_ROUTES.MANAGE, {
      state: {
        selectedTab: PROFILE_TABS.USER_MANAGEMENT,
      },
    });
  };

  return (
    <div className="dashboard-page dashboard-page--edit-user">
      <Box className="dashboard-page__banner layout-box">
        <Banner
          bannerText={`Edit User: ${userInfo?.firstName} ${" "} ${userInfo?.lastName}`}
          bannerSubtext={
            <div>
              <strong>Date Created:</strong>
              &nbsp;
              {applyWhenNotNullable(
                (dateTimeStr: string) =>
                  toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                userInfo?.createdDateTime,
                "",
              )}
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <strong>Last Updated:</strong>&nbsp;{" "}
              {getDefaultRequiredVal(
                "",
                applyWhenNotNullable(
                  (dateTimeStr: string) =>
                    toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                  userInfo?.updatedDateTime,
                ),
                applyWhenNotNullable(
                  (dateTimeStr: string) =>
                    toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                  userInfo?.createdDateTime,
                  "",
                ),
              )}
            </div>
          }
        />
      </Box>

      <Box className="dashboard-page__breadcrumb layout-box">
        <Typography
          className="breadcrumb-link breadcrumb-link--parent"
          onClick={onClickBreadcrumb}
        >
          Profile
        </Typography>

        <FontAwesomeIcon className="breadcrumb-icon" icon={faChevronRight} />

        <Typography
          className="breadcrumb-link breadcrumb-link--parent"
          onClick={onClickBreadcrumb}
        >
          Add / Manage Users
        </Typography>

        <FontAwesomeIcon className="breadcrumb-icon" icon={faChevronRight} />

        <Typography>Edit User</Typography>
      </Box>

      {!isPending && <EditUserForm userInfo={userInfo} />}
    </div>
  );
});

EditUserDashboard.displayName = "EditUserDashboard";
