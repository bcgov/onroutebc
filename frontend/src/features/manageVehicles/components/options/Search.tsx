import { Paper, IconButton, InputBase, Menu, MenuItem, Checkbox } from "@mui/material";
import React from "react";

const options = ["All", "Unit Number", "VIN", "Plate"];

const ITEM_HEIGHT = 48;

export const Search = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 380 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
          onClick={handleClick}
          onSubmit={() => {
            window.alert("Submitted!");
          }}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <i className="fa fa-search"></i>
        </IconButton>
      </Paper>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "search-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
          >
            <Checkbox/> {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
