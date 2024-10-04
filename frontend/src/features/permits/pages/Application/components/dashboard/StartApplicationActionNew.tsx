/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NestedDropdown } from "mui-nested-menu";
import { APPLICATIONS_ROUTES } from "../../../../../../routes/constants";
import {
  PERMIT_CATERGORY_CHOOSE_FROM_OPTIONS,
  PermitTypeChooseFromItem,
} from "../../../../constants/constants";
import { EMPTY_PERMIT_CATEGORY_SELECT } from "../../../../types/PermitCategory";
import {
  DEFAULT_PERMIT_TYPE,
  EMPTY_PERMIT_TYPE_SELECT,
  PermitType,
} from "../../../../types/PermitType";
import "./StartApplicationAction.scss";

export const StartApplicationActionNew = () => {
  const navigate = useNavigate();
  const [chooseFrom, setChooseFrom] = useState<
    PermitType | typeof EMPTY_PERMIT_TYPE_SELECT
  >(DEFAULT_PERMIT_TYPE);

  const handleChooseFrom = (
    event: React.MouseEvent<HTMLElement>,
    item: PermitTypeChooseFromItem,
  ) => {
    console.log(item.value);
    setChooseFrom(item.value as PermitType | typeof EMPTY_PERMIT_TYPE_SELECT); // Use item.value instead of event.target.value
  };

  const handleStartButtonClicked = () => {
    if (chooseFrom !== EMPTY_PERMIT_TYPE_SELECT) {
      navigate(APPLICATIONS_ROUTES.START_APPLICATION(chooseFrom));
    }
  };

  // Update the structure of menuItems to ensure the callback is applied correctly
  const menuItems = PERMIT_CATERGORY_CHOOSE_FROM_OPTIONS.map(
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
      <NestedDropdown
        onClick={handleClick}
        menuItemsData={{
          label: EMPTY_PERMIT_CATEGORY_SELECT,
          items: menuItems,
        }}
        MenuProps={{
          className: "start-application-action___menu-backdrop",
          anchorEl: anchorEl,
          open: open,
          onClose: handleClose,
          slotProps: {
            paper: {
              className: `start-application-action__menu-container ${open && "start-application-action__menu-container--open"}`,
            },
            root: {
              className: "ROOT",
            },
          },
          MenuListProps: {
            className: `start-application-action__menu-list  ${open && "start-application-action__menu-list--open"}`,
            onClick: handleClose,
          },
        }}
        ButtonProps={{
          className: `start-application-action__input ${open && "start-application-action__input--open"}`,
        }}
      />

      <Button
        className="start-application-action__btn"
        variant="contained"
        onClick={handleStartButtonClicked}
      >
        Start Application
      </Button>
    </Box>
  );
};
