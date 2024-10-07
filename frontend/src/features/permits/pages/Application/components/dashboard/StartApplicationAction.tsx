/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, FormLabel, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NestedMenuItem } from "mui-nested-menu";
import { APPLICATIONS_ROUTES } from "../../../../../../routes/constants";
import {
  ALL_PERMIT_TYPE_CHOOSE_FROM_OPTIONS,
  PermitTypeChooseFromItem,
} from "../../../../constants/constants";
import {
  EMPTY_PERMIT_TYPE_SELECT,
  PermitType,
  permitTypeDisplayText,
} from "../../../../types/PermitType";
import "./StartApplicationAction.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const StartApplicationAction = () => {
  const navigate = useNavigate();
  const [chooseFrom, setChooseFrom] = useState<
    PermitType | typeof EMPTY_PERMIT_TYPE_SELECT
  >(EMPTY_PERMIT_TYPE_SELECT);

  const handleChooseFrom = (
    _event: React.MouseEvent<HTMLElement>,
    item: PermitTypeChooseFromItem,
  ) => {
    console.log(item.value);
    setChooseFrom(item.value as PermitType); // Use item.value instead of event.target.value
    handleClose();
  };

  const handleStartButtonClicked = () => {
    if (chooseFrom !== EMPTY_PERMIT_TYPE_SELECT) {
      navigate(APPLICATIONS_ROUTES.START_APPLICATION(chooseFrom));
    }
  };

  // Update the structure of menuItems to ensure the callback is applied correctly
  const menuItems = ALL_PERMIT_TYPE_CHOOSE_FROM_OPTIONS.map(
    (item: PermitTypeChooseFromItem) => ({
      ...item,
      callback: (event: React.MouseEvent<HTMLElement>) =>
        handleChooseFrom(event, item),
      items: item?.items?.map((nestedItem) => ({
        ...nestedItem,
        callback: (event: React.MouseEvent<HTMLElement>) =>
          handleChooseFrom(event, nestedItem), // Correctly set the nested item's callback
      })),
    }),
  );

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>();
  const open = Boolean(anchorEl);

  const handleClick = (e: any) =>
    setAnchorEl(e.currentTarget as HTMLDivElement);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box className="start-application-action">
      <FormLabel className="start-application-action__label">
        Select Permit Type
      </FormLabel>
      <div className="start-application-action__control">
        <Button
          className={`start-application-action__input ${open && "start-application-action__input--open"}`}
          onClick={handleClick}
        >
          <div className="start-application-action__input-inner">
            {chooseFrom !== EMPTY_PERMIT_TYPE_SELECT
              ? permitTypeDisplayText(chooseFrom)
              : EMPTY_PERMIT_TYPE_SELECT}
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </Button>

        <Menu
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}
          className="MENU"
          slotProps={{
            paper: {
              className: `start-application-action__menu-container ${open && "start-application-action__menu-container--open"}`,
            },
          }}
          MenuListProps={{
            className: "start-application-action__menu-list",
          }}
        >
          {menuItems.map((item) =>
            item.items ? (
              <NestedMenuItem
                label={item.label}
                parentMenuOpen={open}
                key={item.label}
                MenuProps={{
                  MenuListProps: {
                    className: "start-application-action__nested-menu-list",
                  },
                  slotProps: {
                    paper: {
                      className:
                        "start-application-action__nested-menu-container",
                    },
                  },
                }}
              >
                {item.items.map((nestedItem) => (
                  <MenuItem
                    key={nestedItem.label}
                    onClick={nestedItem.callback}
                  >
                    {nestedItem.label}
                  </MenuItem>
                ))}
              </NestedMenuItem>
            ) : (
              <MenuItem key={item.label} onClick={item.callback}>
                {item.label}
              </MenuItem>
            ),
          )}
        </Menu>

        <Button
          className="start-application-action__btn"
          variant="contained"
          onClick={handleStartButtonClicked}
        >
          Start Application
        </Button>
      </div>
    </Box>
  );
};
