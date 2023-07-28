import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCallback } from "react";
import { getPermitPdfURL } from "../../apiManager/permitsAPI";

const ACTIVE_OPTIONS = ["View Receipt"];
const EXPIRED_OPTIONS = ["View Receipt"];

const getOptions = (isExpired: boolean): string[] => {
  if (isExpired) {
    return EXPIRED_OPTIONS;
  }
  return ACTIVE_OPTIONS;
};

const ITEM_HEIGHT = 48;

export const PermitRowOptions = ({
  isExpired,
  permitId,
}: {
  isExpired: boolean;
  permitId: string;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = (_event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
  };

  const onClickOption = (event: React.MouseEvent<HTMLElement>) => {
    const selectedOption = event.currentTarget.outerText as string;

    if (selectedOption === "View Receipt") {
      getPermitPdfURL(permitId).then((response) => {
        if (response.presignedUrl) {
          window.open(response.presignedUrl, "_blank");
        }
      });
    }
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "15ch",
          },
        }}
      >
        {getOptions(isExpired).map((option) => (
          <MenuItem key={option} onClick={onClickOption} option-value={option}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
