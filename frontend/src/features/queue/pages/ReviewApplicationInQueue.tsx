import { Box } from "@mui/material";
import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";

import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { Banner } from "../../../common/components/dashboard/components/banner/Banner";
import { Loading } from "../../../common/pages/Loading";
// import { UniversalUnauthorized } from "../../../common/pages/UniversalUnauthorized";
import { useApplicationDetailsQuery } from "../../permits/hooks/hooks";
import { ApplicationInQueueReview } from "../components/ApplicationInQueueReview";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../common/helpers/util";
import { ERROR_ROUTES } from "../../../routes/constants";

export const ReviewApplicationInQueue = () => {
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const {
    companyId: companyIdParam,
    permitId: permitIdParam,
  } = useParams();
  
  const companyId: number = applyWhenNotNullable(id => Number(id), companyIdParam, 0);
  const permitId = getDefaultRequiredVal("", permitIdParam);

  const {
    query: {
      data: applicationData,
    },
  } = useApplicationDetailsQuery({
    companyId,
    permitId,
  });

  if (!companyId || !permitId) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  if (
    typeof applicationData === "undefined" ||
    typeof idirUserDetails === "undefined"
  ) {
    return <Loading />;
  }
  
  /*
   * Find another way to authorize user, as application details doesn't have "claimedBy" field
   *
   * // If current user is not the claimant of the application, show unauthorized
   * if (idirUserDetails.userName !== application?.claimedBy) {
   *   return <UniversalUnauthorized />;
   * }
   */

  return (
    <div className="review-application-in-queue">
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText="Review and Confirm Details" />
      </Box>
      
      <ApplicationInQueueReview />
    </div>
  );
};
