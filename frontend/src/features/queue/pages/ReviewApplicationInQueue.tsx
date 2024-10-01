import { Box } from "@mui/material";
import { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { Banner } from "../../../common/components/dashboard/components/banner/Banner";
import { Loading } from "../../../common/pages/Loading";
import { UniversalUnauthorized } from "../../../common/pages/UniversalUnauthorized";
import { APPLICATION_STEPS } from "../../../routes/constants";
import { useApplicationDetailsQuery } from "../../permits/hooks/hooks";
import { ApplicationInQueueReview } from "../components/ApplicationInQueueReview";
import { ReviewApplicationInQueueContext } from "../context/ReviewApplicationInQueueContext";
import { useApplicationInQueueDetailsQuery } from "../hooks/hooks";

export const ReviewApplicationInQueue = () => {
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const { applicationNumber = "" } = useParams();
  const { data: application } =
    useApplicationInQueueDetailsQuery(applicationNumber);

  // Query for the application data whenever this page is rendered
  const { applicationData, setApplicationData } = useApplicationDetailsQuery({
    applicationStep: APPLICATION_STEPS.REVIEW,
    companyId: application?.companyId,
    permitId: application?.permitId,
    permitType: application?.permitType,
  });

  const contextData = useMemo(
    () => ({
      applicationData,
      setApplicationData,
    }),
    [applicationData, setApplicationData],
  );

  if (
    typeof applicationData === "undefined" ||
    typeof idirUserDetails === "undefined"
  ) {
    return <Loading />;
  } else if (idirUserDetails.userName !== application?.claimedBy) {
    /* If current user is not the claimant of the application, show unauthorized. */
    return <UniversalUnauthorized />;
  } else
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
