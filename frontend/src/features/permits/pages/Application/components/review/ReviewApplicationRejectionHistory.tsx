import { Box, Typography } from "@mui/material";
import { ApplicationRejectionHistory } from "../../../../types/ApplicationRejectionHistory";
import "./ReviewApplicationRejectionHistory.scss";
import {
  DATE_FORMATS,
  toLocal,
} from "../../../../../../common/helpers/formatDate";
import { usePermissionMatrix } from "../../../../../../common/authentication/PermissionMatrix";

export const ReviewApplicationRejectionHistory = ({
  applicationRejectionHistory,
}: {
  applicationRejectionHistory: ApplicationRejectionHistory[];
}) => {
  const canViewApplicationQueue = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "STAFF_HOME_SCREEN",
      permissionMatrixFunctionKey: "VIEW_QUEUE",
    },
  });

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
          {applicationRejectionHistory.map((item) => (
            <Box
              className="rejection-history__item item"
              key={item.caseActivityId}
            >
              <div className="item__row item__row--flex">
                <Typography>
                  {canViewApplicationQueue
                    ? `${item.userName}, ${toLocal(item.dateTime, DATE_FORMATS.LONG)}`
                    : toLocal(item.dateTime, DATE_FORMATS.LONG)}
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
