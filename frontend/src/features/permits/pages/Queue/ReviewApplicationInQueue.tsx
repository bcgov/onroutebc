/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import { Banner } from "../../../../common/components/dashboard/components/banner/Banner";
import { ReviewApplicationInQueueContext } from "./context/ReviewApplicationInQueueContext";
import { useContext, useMemo } from "react";
import {
  useApplicationInQueueDetailsQuery,
  useReviewApplicationInQueueDetailsQuery,
} from "../../hooks/hooks";
import { useParams } from "react-router-dom";
import { APPLICATION_STEPS } from "../../../../routes/constants";
import { ApplicationInQueueReview } from "./components/ApplicationInQueueReview";
import { Loading } from "../../../../common/pages/Loading";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { UniversalUnauthorized } from "../../../../common/pages/UniversalUnauthorized";

export const ReviewApplicationInQueue = () => {
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const { applicationNumber = "" } = useParams();
  const { data: application } =
    useApplicationInQueueDetailsQuery(applicationNumber);

  // Query for the application data whenever this page is rendered
  const { applicationData, setApplicationData } =
    useReviewApplicationInQueueDetailsQuery(
      APPLICATION_STEPS.REVIEW,
      application?.companyId,
      application?.permitId,
      application?.permitType,
    );

  const contextData = useMemo(
    () => ({
      applicationData,
      setApplicationData,
    }),
    [applicationData, setApplicationData],
  );

  if (typeof applicationData === "undefined") {
    return <Loading />;
  }

  /* If current user is not the claimant of the application, show unauthorized. */
  if (idirUserDetails?.userName !== application?.claimedBy) {
    return <UniversalUnauthorized />;
  }

  return (
    <ReviewApplicationInQueueContext.Provider value={contextData}>
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
    </ReviewApplicationInQueueContext.Provider>
  );
};
