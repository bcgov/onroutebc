import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  useState,
  useRef,
  useEffect,
  SyntheticEvent,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent,
} from "react";

import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";

import "./AddVehicleButton.scss";
import { VEHICLES_ROUTES } from "../../../../routes/constants";
import { VEHICLE_TYPES, VehicleType } from "../../types/Vehicle";

export const AddVehicleButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const options = [
    {
      vehicleMode: VEHICLE_TYPES.POWER_UNIT,
      labelValue: "Power Unit",
    },
    {
      vehicleMode: VEHICLE_TYPES.TRAILER,
      labelValue: "Trailer",
    },
  ];

  const handleToggle = () => {
    setIsMenuOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | SyntheticEvent) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }

    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (
    _event: ReactMouseEvent<HTMLLIElement, MouseEvent>,
    _index: number,
    vehicleMode: VehicleType,
  ) => {
    if (vehicleMode === VEHICLE_TYPES.POWER_UNIT) {
      navigate(VEHICLES_ROUTES.ADD_POWER_UNIT);
    } else if (vehicleMode === VEHICLE_TYPES.TRAILER) {
      navigate(VEHICLES_ROUTES.ADD_TRAILER);
    }

    setIsMenuOpen(false);
  };

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setIsMenuOpen(false);
    } else if (event.key === "Escape") {
      setIsMenuOpen(false);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(isMenuOpen);
  useEffect(() => {
    if (prevOpen.current === true && isMenuOpen === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = isMenuOpen;
  }, [isMenuOpen]);

  return (
    <Stack direction="row" spacing={2} className="add-vehicle">
      <div className="add-vehicle__container">
        <Button
          ref={anchorRef}
          id="composition-button"
          variant="contained"
          aria-controls={isMenuOpen ? "composition-menu" : undefined}
          aria-expanded={isMenuOpen ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className="add-vehicle__button"
        >
          <span className="add-vehicle__label">Add Vehicle</span>
          <FontAwesomeIcon className="add-vehicle__icon" icon={faChevronDown} />
        </Button>

        <Popper
          open={isMenuOpen}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-end"
          transition
          disablePortal
          className="add-vehicle__popper"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={isMenuOpen}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {options.map((option, index) => {
                      const { vehicleMode, labelValue } = option;
                      return (
                        <MenuItem
                          key={vehicleMode}
                          onClick={(event) =>
                            handleMenuItemClick(event, index, vehicleMode)
                          }
                        >
                          {labelValue}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
};
