import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Typography
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./EditUserDashboard.scss";
import { Banner } from "../../../common/components/dashboard/Banner";
import { getCompanyUserByUserGUID } from "../apiManager/manageProfileAPI";
import { EditUserForm } from "../components/forms/userManagement/EditUser";
import { BCEID_PROFILE_TABS } from "../types/manageProfile.d";
import { DATE_FORMATS, toLocal } from "../../../common/helpers/formatDate";
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

  const { data: userInfo, isLoading } = useQuery(
    ["userByuserGUID", userGUID],
    () => getCompanyUserByUserGUID(userGUID as string),
    { retry: false, enabled: true, staleTime: Infinity }
  );

  const onClickBreadcrumb = () => {
    navigate("../", {
      state: {
        selectedTab: BCEID_PROFILE_TABS.USER_MANAGEMENT_ORGADMIN,
      },
    });
  };

  return (
    <div className="dashboard-page dashboard-page--edit-user">
      <Box
        className="dashboard-page__banner layout-box"
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
        className="dashboard-page__breadcrumb layout-box"
      >
        <Typography
          className="breadcrumb-link breadcrumb-link--parent"
          onClick={onClickBreadcrumb}
        >
          Profile
        </Typography>

        <FontAwesomeIcon
          className="breadcrumb-icon"
          icon={faChevronRight}
        />

        <Typography
          className="breadcrumb-link breadcrumb-link--parent"
          onClick={onClickBreadcrumb}
        >
          User Management
        </Typography>

        <FontAwesomeIcon
          className="breadcrumb-icon"
          icon={faChevronRight}
        />

        <Typography>Edit User</Typography>
      </Box>

      {!isLoading && <EditUserForm userInfo={userInfo} />}
    </div>
  );
});

EditUserDashboard.displayName = "EditUserDashboard";
