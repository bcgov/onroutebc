import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { useCallback } from "react";

const ITEM_HEIGHT = 48;

/**
 * A reusable component meant to be used in table components for row actions.
 */
export const OnRouteBCTableRowActions = ({
  onSelectOption,
  options,
  disabled = false,
}: {
  /**
   * Callback function to be called upon a user selecting an option.
   * @param selectedOption The selected option as a string.
   */
  onSelectOption: (selectedOption: string) => void;

  /**
   * The options to be shown in the menu.
   */
  options: {
    label: string;
    value: string;
  }[];

  /**
   * Disables the row action icon if set to true. Defaults to false.
   */
  disabled?: boolean;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Event handler for an option select. Gives a callback to the
   * callback function passed with the selected option as a parameter.
   * @param event The click event containing the target value.
   */
  const onClickOption = (event: React.MouseEvent<HTMLElement>) => {
    const selectedOption = event.currentTarget.dataset.optionValue as string;
    onSelectOption(selectedOption);
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
        disabled={disabled}
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
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "15ch",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={`option-${option.value}`}
            onClick={onClickOption}
            data-option-value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
