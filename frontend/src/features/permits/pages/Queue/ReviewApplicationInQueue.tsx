/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import { Banner } from "../../../../common/components/dashboard/components/banner/Banner";
import { ReviewApplicationInQueueContext } from "./context/ReviewApplicationInQueueContext";
import { useMemo } from "react";
import {
  useApplicationInQueueDetailsQuery,
  useReviewApplicationInQueueDetailsQuery,
} from "../../hooks/hooks";
import { useParams } from "react-router-dom";
import { APPLICATION_STEPS } from "../../../../routes/constants";
import { ApplicationInQueueReview } from "./components/ApplicationInQueueReview";
import { Loading } from "../../../../common/pages/Loading";

export const ReviewApplicationInQueue = () => {
  const { applicationNumber = "" } = useParams();
  const { data } = useApplicationInQueueDetailsQuery(applicationNumber);

  const application = data?.items[0];

  // Query for the application data whenever this page is rendered
  const {
    applicationData,
    setApplicationData,
    shouldEnableQuery,
    isInvalidRoute,
  } = useReviewApplicationInQueueDetailsQuery(
    APPLICATION_STEPS.REVIEW,
    application?.companyId,
    application?.permitId,
    application?.permitType,
  );

  console.log(applicationData);

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
