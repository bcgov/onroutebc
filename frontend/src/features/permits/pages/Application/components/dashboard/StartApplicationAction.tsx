import { Box, Button, FormLabel, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NestedMenuItem } from "mui-nested-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import "./StartApplicationAction.scss";
import { useFeatureFlagsQuery } from "../../../../../../common/hooks/hooks";
import { APPLICATIONS_ROUTES } from "../../../../../../routes/constants";
import { PERMIT_CATEGORIES } from "../../../../types/PermitCategory";
import {
  ALL_PERMIT_TYPE_CHOOSE_FROM_OPTIONS,
  PermitTypeChooseFromItem,
} from "../../../../constants/constants";

import {
  EMPTY_PERMIT_TYPE_SELECT,
  PERMIT_TYPES,
  PermitType,
  getFormattedPermitTypeName,
} from "../../../../types/PermitType";

export const StartApplicationAction = () => {
  const navigate = useNavigate();
  const [chooseFrom, setChooseFrom] = useState<
    PermitType | typeof EMPTY_PERMIT_TYPE_SELECT
  >(EMPTY_PERMIT_TYPE_SELECT);

  const [isError, setIsError] = useState<boolean>(false);

  const { data: featureFlags } = useFeatureFlagsQuery();
  const enableSTOS = featureFlags?.["STOS"] === "ENABLED";
  const enableSTOW = featureFlags?.["STOW"] === "ENABLED";
  const enableMFP = featureFlags?.["MFP"] === "ENABLED";
  const enableSTFR = featureFlags?.["STFR"] === "ENABLED";
  const enableQRFR = featureFlags?.["QRFR"] === "ENABLED";
  const enableNRSCV = featureFlags?.["NRSCV"] === "ENABLED";
  const enableNRQCV = featureFlags?.["NRQCV"] === "ENABLED";

  const showSingleTrip = enableSTOS || enableSTOW;
  const showNonResident =
    enableSTFR || enableQRFR || enableNRSCV || enableNRQCV;

  const handleChooseFrom = (
    _event: React.MouseEvent<HTMLElement>,
    item: PermitTypeChooseFromItem,
  ) => {
    setIsError(false);
    setChooseFrom(item.value as PermitType);
    handleClose();
  };

  const handleStartButtonClicked = () => {
    if (chooseFrom !== EMPTY_PERMIT_TYPE_SELECT) {
      navigate(APPLICATIONS_ROUTES.START_APPLICATION(chooseFrom));
    } else {
      setIsError(true);
    }
  };

  // Build menu items once: filter disabled top-level items then conditionally
  // filter nested items based on the top-level category and feature flags.
  const menuItems = ALL_PERMIT_TYPE_CHOOSE_FROM_OPTIONS.filter((option) =>
    showSingleTrip ? true : option.value !== PERMIT_CATEGORIES.SINGLE_TRIP,
  )
    .filter((option) => (enableMFP ? true : option.value !== PERMIT_TYPES.MFP))
    .filter((option) =>
      showNonResident ? true : option.value !== PERMIT_CATEGORIES.NON_RESIDENT,
    )
    .map((item: PermitTypeChooseFromItem) => {
      const items = item?.items
        ?.filter((nestedItem) => {
          if (item.value === PERMIT_CATEGORIES.SINGLE_TRIP) {
            return (
              (nestedItem.value === PERMIT_TYPES.STOS && enableSTOS) ||
              (nestedItem.value === PERMIT_TYPES.STOW && enableSTOW)
            );
          }
          if (item.value === PERMIT_CATEGORIES.NON_RESIDENT) {
            return (
              (nestedItem.value === PERMIT_TYPES.STFR && enableSTFR) ||
              (nestedItem.value === PERMIT_TYPES.QRFR && enableQRFR) ||
              (nestedItem.value === PERMIT_TYPES.NRSCV && enableNRSCV) ||
              (nestedItem.value === PERMIT_TYPES.NRQCV && enableNRQCV)
            );
          }
          return true;
        })
        ?.map((nestedItem) => ({
          ...nestedItem,
          callback: (event: React.MouseEvent<HTMLElement>) =>
            handleChooseFrom(event, nestedItem),
        }));

      return {
        ...item,
        callback: (event: React.MouseEvent<HTMLElement>) =>
          handleChooseFrom(event, item),
        items,
      };
    });

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>();
  const open = Boolean(anchorEl);

  const handleClick = (e: any) =>
    setAnchorEl(e.currentTarget as HTMLDivElement);
  const handleClose = () => setAnchorEl(null);

  const inputClass = "start-application-action__input";
  const inputOpenClass = "start-application-action__input--open";
  const inputErrorClass = "start-application-action__input--error";
  const menuClass = "start-application-action__menu-container";
  const menuOpenClass = "start-application-action__menu-container--open";

  return (
    <Box className="start-application-action">
      <FormLabel className="start-application-action__label">
        Select Permit Type
      </FormLabel>
      <div className="start-application-action__control">
        <Tooltip
          className="start-application-action__input-tooltip"
          title={
            chooseFrom !== EMPTY_PERMIT_TYPE_SELECT
              ? getFormattedPermitTypeName(chooseFrom)
              : EMPTY_PERMIT_TYPE_SELECT
          }
        >
          <Button
            className={`${inputClass} ${open ? inputOpenClass : ""} ${isError ? inputErrorClass : ""}`}
            onClick={handleClick}
          >
            <span className="start-application-action__input-text">
              {chooseFrom !== EMPTY_PERMIT_TYPE_SELECT
                ? getFormattedPermitTypeName(chooseFrom)
                : EMPTY_PERMIT_TYPE_SELECT}
            </span>
            <FontAwesomeIcon
              className="start-application__input-icon"
              icon={faChevronDown}
            />
          </Button>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}
          slotProps={{
            paper: {
              className: `${menuClass} ${open ? menuOpenClass : ""}`,
            },
          }}
          MenuListProps={{
            className: "start-application-action__menu-list",
          }}
        >
          {menuItems.map((item) =>
            item.items ? (
              <NestedMenuItem
                className="start-application-action__menu-item"
                label={item.label}
                parentMenuOpen={open}
                key={item.value}
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
                    className="start-application-action__nested-menu-item"
                    key={nestedItem.value}
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
      {isError ? (
        <span className="start-application-action__error-msg">
          Select a permit type.
        </span>
      ) : null}
    </Box>
  );
};
