import { Button, Menu, MenuItem } from "@mui/material";
import { MRT_TableInstance } from "material-react-table";
import { useState } from "react";
import { IPowerUnit } from "../../@types/managevehicles";

const options = ["AST", "BBB", "CCC"];
const ITEM_HEIGHT = 48;

export const Filter= ({
  table,
}: {
  table: MRT_TableInstance<IPowerUnit>;
}) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    //table.setShowFilters(true);
    console.log("table.getGlobalFilterFn()", table.getGlobalFilterFn());
    console.log("table.getGlobalAutoFilterFn()", table.getGlobalAutoFilterFn());
    console.log("table.getAllColumns()", table.getAllColumns());
    //console.log(table.setColumnFilters("5555"));
    //table.setColumnFilters([{id: 'vin', value: '5'}])
  };
  const handleClose = () => {
    setAnchorEl(null);
    table.setShowFilters(false);
    table.resetColumnFilters();
  };

  return (
    <>
      <Button
        aria-label="filter"
        id="filter-button"
        variant="contained"
        color="secondary"
        aria-controls={open ? "filter-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<i className="fa fa-filter"></i>}
        sx={{ margin: "0px 20px" }}
      >
        Filter
      </Button>
      <Menu
        id="filter-menu"
        MenuListProps={{
          "aria-labelledby": "filter-button",
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
            onClick={() => {
              table.setColumnFilters([{ id: "plateNumber", value: option }]);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
