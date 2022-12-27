import { Button, Checkbox, Menu, MenuItem } from "@mui/material";
import { MRT_TableInstance } from "material-react-table";
import { useState } from "react";
import { IPowerUnit } from "../../@types/managevehicles";
import { NestedMenuItem } from "mui-nested-menu";

const options = [
  {
    label: "Plate Number",
    accessKey: "plateNumber",
    subOptions: [
      { label: "AST", isChecked: false },
      { label: "BBB", isChecked: false },
      { label: "CCC", isChecked: false },
    ],
  },
  {
    label: "Vehicle Type",
    accessKey: "vin",
    subOptions: [
      { label: "Trailer", isChecked: false },
      { label: "Tandem", isChecked: false },
    ],
  },
];

export const Filter = ({ table }: { table: MRT_TableInstance<IPowerUnit> }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /*
  const [isChecked, setIsChecked] = useState(() =>
    options.map(({ subOptions }) => subOptions.map(() => false))
  );
  */

  const [filters, setFilters] = useState(options);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    table.setShowFilters(false);
    table.resetColumnFilters();
  };

  /*
  const toggleCheckboxValue = (parentIndex: number, subIndex: number) => {
    const updatedCheckboxes = isChecked.map((parent, i) =>
      parent.map((sub, j) => (i === parentIndex && j === subIndex ? !sub : sub))
    );
    setIsChecked(updatedCheckboxes);
  };
  */

  const toggleCheckboxes = (parentIndex: number, subIndex: number) => {
    const updatedCheckboxes = filters;
    updatedCheckboxes[parentIndex].subOptions[subIndex].isChecked =
      !updatedCheckboxes[parentIndex].subOptions[subIndex].isChecked;
    setFilters(updatedCheckboxes);
    assignFilters(updatedCheckboxes);
  };

  const assignFilters = (
    filters: {
      label: string;
      accessKey: string;
      subOptions: { label: string; isChecked: boolean }[];
    }[]
  ) => {
    filters.map((parent) =>
      parent.subOptions.map((sub) => {
        if (sub.isChecked) {
          table.setColumnFilters([{ id: parent.accessKey, value: sub.label }]);
        }
      })
    );
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
            maxHeight: 200,
            width: "20ch",
          },
        }}
      >
        {options.map((option, parentIndex) => (
          <NestedMenuItem
            key={option.label}
            label={option.label}
            parentMenuOpen={open}
          >
            {option.subOptions.map((subOption, index) => (
              <MenuItem
                key={subOption.label}
              >
                <Checkbox
                  key={subOption.label}
                  onClick={() => toggleCheckboxes(parentIndex, index)}
                  checked={filters[parentIndex].subOptions[index].isChecked}
                />
                {subOption.label}
              </MenuItem>
            ))}
          </NestedMenuItem>
        ))}
      </Menu>
    </>
  );
};
