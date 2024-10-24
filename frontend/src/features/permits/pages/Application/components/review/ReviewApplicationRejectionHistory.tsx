/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import { ApplicationRejectionHistory } from "../../../../types/ApplicationRejectionHistory";
import "./ReviewApplicationRejectionHistory.scss";
import {
  DATE_FORMATS,
  dayjsToLocalStr,
} from "../../../../../../common/helpers/formatDate";
import { canViewApplicationQueue } from "../../../../../queue/helpers/canViewApplicationQueue";
import { useContext } from "react";
import OnRouteBCContext from "../../../../../../common/authentication/OnRouteBCContext";

export const ReviewApplicationRejectionHistory = ({
  applicationRejectionHistory,
}: {
  applicationRejectionHistory: ApplicationRejectionHistory[];
}) => {
  const { idirUserDetails } = useContext(OnRouteBCContext);

  const reversedApplicationRejectionHistory = applicationRejectionHistory
    .slice()
    .reverse();

  return (
    <Box className="rejection-history">
      <Box className="rejection-history__header">
        <Typography
          variant={"h3"}
          className="rejection-history__title"
          data-testid="rejection-history-title"
        >
          Rejection History
        </Typography>
      </Box>
      <Box className="rejection-history__body">
        <Box className="rejection-history__info">
          {reversedApplicationRejectionHistory.map((item) => (
            <Box
              className="rejection-history__item item"
              key={item.caseActivityId}
            >
              <div className="item__row item__row--flex">
                <Typography>
                  {canViewApplicationQueue(idirUserDetails?.userRole)
                    ? `${item.userName}, ${dayjsToLocalStr(item.dateTime, DATE_FORMATS.LONG)}`
                    : dayjsToLocalStr(item.dateTime, DATE_FORMATS.LONG)}
                </Typography>
              </div>
              <div className="item__row">
                <Typography>{item.caseNotes}</Typography>
              </div>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
