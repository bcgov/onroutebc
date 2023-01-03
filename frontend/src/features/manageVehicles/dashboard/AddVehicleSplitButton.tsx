import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Vehicle } from '../../../constants/enums';
import { useTranslation } from "react-i18next";

interface SplitButtonProps {
  setFormMode: (mode: Vehicle) => void;
  openSlidePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddVehicleSplitButton({
  setFormMode,
  openSlidePanel
}: SplitButtonProps) {
  const { t } = useTranslation();
  const options = [
    {
      vehicleMode: Vehicle.POWER_UNIT,
      translationKey: "vehicle.power-unit"
    },
    {
      vehicleMode: Vehicle.TRAILER,
      translationKey: "vehicle.trailer"
    },
  ]
  // const options = [t("vehicle.power-unit"), t("vehicle.trailer")];
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  // setFormMode(Vehicle.POWER_UNIT);

  const handleClick = () => {
    // console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
    vehicleMode: Vehicle,
  ) => {
    setSelectedIndex(index);
    setFormMode(vehicleMode);
    openSlidePanel(true);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick} style={{textTransform: 'none'}}>Add Vehicle</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => {
                    const { vehicleMode, translationKey } = option;
                    return (
                    <MenuItem
                      key={vehicleMode}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index, vehicleMode)}
                    >
                      {t(translationKey)}
                    </MenuItem>
                  )})}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
