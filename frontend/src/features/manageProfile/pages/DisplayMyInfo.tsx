import { memo } from "react";
import { Box, Button, Typography } from "@mui/material";

import { UserInformation } from "../types/manageProfile";
import { formatPhoneNumber } from "../../../common/components/form/subFormComponents/PhoneNumberInput";
import { formatProvince } from "../../../common/helpers/formatCountryProvince";
import { formatCountry } from "../../../common/helpers/formatCountryProvince";

export const DisplayMyInfo = memo(({
  myInfo,
  setIsEditing,
}: {
  myInfo?: UserInformation;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (!myInfo) return <></>;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "40px",
      }}
    >
      <Box>
        <Typography variant="h3">
          {`${myInfo.firstName} ${myInfo.lastName}`}
        </Typography>
        <Typography>
          Email: {myInfo.email}
        </Typography>
        <Typography>
          Primary Phone: {formatPhoneNumber(myInfo.phone1)} {myInfo.phone1Extension ? `Ext: ${myInfo.phone1Extension}` : ""}
        </Typography>
        {myInfo.phone2 ? (
          <Typography>
            Alternate Phone: {formatPhoneNumber(myInfo.phone2)} {myInfo.phone2Extension ? `Ext: ${myInfo.phone2Extension}` : ""}
          </Typography>
        ) : null}
        {myInfo.fax ? (
          <Typography>
            Fax: {formatPhoneNumber(myInfo.fax)}
          </Typography>
        ) : null}
        <Typography>
          {formatCountry(myInfo.countryCode)}
        </Typography>
        <Typography>
          {formatProvince(myInfo.countryCode, myInfo.provinceCode)}
        </Typography>
        <Typography>
          {myInfo.city}
        </Typography>
      </Box>
      <div>
        <Button
          variant="contained"
          color="tertiary"
          sx={{ marginTop: "20px" }}
          onClick={() => setIsEditing(true)}
        >
          <i className="fa fa-pencil" style={{ marginRight: "7px" }} />
          Edit
        </Button>
      </div>
    </Box>
  );
});

DisplayMyInfo.displayName = "DisplayMyInfo";
