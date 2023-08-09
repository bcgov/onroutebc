import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const OPTIONS = ["Edit"];

const ITEM_HEIGHT = 48;

export const UserManagementRowOptions = ({
  userGUID,
}: {
  userGUID: string;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = (_event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const onClickOption = (event: React.MouseEvent<HTMLElement>) => {
    const selectedOption = event.currentTarget.outerText as string;

    if (selectedOption === "Edit") {
      navigate(`/edit-user`, {
        state: {
          userGUID,
        },
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
        {OPTIONS.map((option) => (
          <MenuItem
            key={`option-${option}`}
            onClick={onClickOption}
            option-value={option}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
