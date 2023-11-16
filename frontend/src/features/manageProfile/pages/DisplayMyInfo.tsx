import { memo } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

import "./DisplayMyInfo.scss";
import { UserInformation } from "../types/manageProfile";
import { formatPhoneNumber } from "../../../common/components/form/subFormComponents/PhoneNumberInput";
import {
  formatProvince,
  formatCountry,
} from "../../../common/helpers/formatCountryProvince";

export const DisplayMyInfo = memo(
  ({
    myInfo,
    setIsEditing,
  }: {
    myInfo?: UserInformation;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    if (!myInfo) return <></>;
    return (
      <div className="my-info-display">
        <Box>
          <Typography variant="h3">
            {`${myInfo.firstName} ${myInfo.lastName}`}
          </Typography>
          <Typography>Email: {myInfo.email}</Typography>
          <Typography>
            Primary Phone: {formatPhoneNumber(myInfo.phone1)}{" "}
            {myInfo.phone1Extension ? `Ext: ${myInfo.phone1Extension}` : ""}
          </Typography>
          {myInfo.phone2 ? (
            <Typography>
              Alternate Phone: {formatPhoneNumber(myInfo.phone2)}{" "}
              {myInfo.phone2Extension ? `Ext: ${myInfo.phone2Extension}` : ""}
            </Typography>
          ) : null}
          {myInfo.fax ? (
            <Typography>Fax: {formatPhoneNumber(myInfo.fax)}</Typography>
          ) : null}
          <Typography>{formatCountry(myInfo.countryCode)}</Typography>
          <Typography>
            {formatProvince(myInfo.countryCode, myInfo.provinceCode)}
          </Typography>
          <Typography>{myInfo.city}</Typography>
        </Box>
        <div className="my-info-display__edit">
          <Button
            variant="contained"
            color="tertiary"
            onClick={() => setIsEditing(true)}
          >
            <FontAwesomeIcon className="edit-icon" icon={faPencil} />
            Edit
          </Button>
        </div>
      </div>
    );
  },
);

DisplayMyInfo.displayName = "DisplayMyInfo";
