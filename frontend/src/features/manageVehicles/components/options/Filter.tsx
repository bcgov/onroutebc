import { Button, Checkbox, Menu, MenuItem } from "@mui/material";
import { MRT_TableInstance } from "material-react-table";
import { useEffect, useState } from "react";
import { IPowerUnit } from "../../@types/managevehicles";
import { NestedMenuItem } from "mui-nested-menu";

const options = [
  {
    label: "Plate Number",
    accessKey: "plateNumber",
    subOptions: [
      { label: "AS", isChecked: false },
      { label: "BBB", isChecked: false },
      { label: "CBA", isChecked: false },
    ],
  },
  {
    label: "VIN",
    accessKey: "vin",
    subOptions: [
      { label: "Trailer", isChecked: false },
      { label: "Tandem", isChecked: false },
    ],
  },
];

export const Filter = ({
  table,
  filters,
}: {
  filters: Array<{ id: string; value: unknown }>;
  table: MRT_TableInstance<IPowerUnit>;
}) => {
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [filterList, setFilterList] = useState(options);

  useEffect(() => {
    // Reset all isChecked values to false
    filterList.forEach((parent) => {
      parent.subOptions.forEach((x) => {
        x.isChecked = false;
      });
    });

    // Update the checkboxes in the Filter button dropdown menu
    // For each applied filter, set the checkbox as true
    filters.forEach((parent) => {
      // cast sub option type as an array
      const arr = parent.value as Array<string>;
      filterList.forEach((p) => {
        if (parent.id === p.accessKey) {
          p.subOptions.forEach((sub) => {
            arr.forEach((x) => {
              // if the filter is applied, then set checkbox to true
              if (sub.label === x) {
                sub.isChecked = true;
              }
            });
          });
        }
      });
    });

    setFilterList(filterList);
  }, [table]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleCheckboxes = (parentIndex: number, subIndex: number) => {
    const updatedCheckboxes = filterList;
    updatedCheckboxes[parentIndex].subOptions[subIndex].isChecked =
      !updatedCheckboxes[parentIndex].subOptions[subIndex].isChecked;
    setFilterList(updatedCheckboxes);
    assignFilters(updatedCheckboxes);
  };

  const assignFilters = (
    filters: {
      label: string;
      accessKey: string;
      subOptions: { label: string; isChecked: boolean }[];
    }[]
  ) => {
    const list: Array<{ id: string; value: unknown }> = [];

    filters.forEach((parent) => {
      const subList: string[] = [];
      let isApplied = false;

      parent.subOptions.forEach((sub) => {
        if (sub.isChecked) {
          isApplied = true;
          subList.push(sub.label);
        }
      });

      if (isApplied) {
        list.push({ id: parent.accessKey, value: subList });
      }
    });

    table.setColumnFilters(list);
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
              <MenuItem key={subOption.label}>
                <Checkbox
                  key={subOption.label}
                  onClick={() => toggleCheckboxes(parentIndex, index)}
                  checked={filterList[parentIndex].subOptions[index].isChecked}
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
