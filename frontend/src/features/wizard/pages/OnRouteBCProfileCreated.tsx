import { Button, Typography } from "@mui/material";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

import "./OnRouteBCProfileCreated.scss";

export const OnRouteBCProfileCreated = memo(
  ({ onRouteBCClientNumber }: { onRouteBCClientNumber?: string }) => {
    const navigate = useNavigate();
    return (
      <div className="profile-created">
        <div className="profile-created__container">
          <div className="profile-created__block profile-created__block--success-img">
            <img
              height="168"
              width="178"
              src="./Success_Graphic.png"
              alt="Profile Set-up Successful"
            />
          </div>
          <div className="profile-created__block profile-created__block--success-msg">
            <Typography variant="h4">Profile Successfully set up!</Typography>
          </div>
          {onRouteBCClientNumber && (
            <div className="profile-created__block profile-created__block--client-number">
              <Typography variant="h3">
                {`Your onRouteBC Client Number is ${onRouteBCClientNumber}`}
              </Typography>
            </div>
          )}
          <div className="profile-created__block profile-created__block--info">
            <Typography variant="body1">
              You can view the company and user information under the Profile
              section. We have also sent you a confirmation email with your
              registration details.
            </Typography>
          </div>
          <div className="profile-created__block profile-created__block--apply-permit">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/applications")}
            >
              Apply for a permit
            </Button>
          </div>
          <div className="profile-created__block profile-created__block--view-profile">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/manage-profiles")}
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

OnRouteBCProfileCreated.displayName = "OnRouteBCProfileCreated";
