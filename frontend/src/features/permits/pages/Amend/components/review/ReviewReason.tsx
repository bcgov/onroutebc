import { Typography } from "@mui/material";

import "./ReviewReason.scss";

export const ReviewReason = ({ reason }: { reason: string }) => {
  return (
    <div className="review-reason">
      <div className="review-reason__header">
        <Typography variant="h3">Reason for Amendment</Typography>
      </div>
      <div className="review-reason__body">{reason}</div>
    </div>
  );
};
