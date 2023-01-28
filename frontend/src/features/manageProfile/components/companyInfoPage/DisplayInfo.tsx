import { Button } from "@mui/material";
import { memo } from "react";

import "./CompanyInfoPage.scss";

export const DisplayInfo = memo(
  ({
    setIsEditting,
  }: {
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <div className="display-info-container">
        <div>
          <h2>Company Address</h2>
          <p>402 Robson Street</p>
          <p>Canada</p>
          <p>BC</p>
          <p>Vancouver V6B 3K9</p>

          <h2>Mailing Address</h2>
          <p>402 Robson Street</p>
          <p>Canada</p>
          <p>BC</p>
          <p>Vancouver V6B 3K9</p>
        </div>
        <div>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: "20px" }}
            onClick={() => setIsEditting(true)}
          >
            <i className="fa fa-pencil" style={{ marginRight: "7px" }}></i>
            Edit
          </Button>
        </div>
      </div>
    );
  }
);

DisplayInfo.displayName = "DisplayInfo";
