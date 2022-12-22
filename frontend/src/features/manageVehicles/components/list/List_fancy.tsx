import { useMemo, useContext, useState } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_TableInstance,
} from "material-react-table";
import "./List.scss";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { IPowerUnit, ManageVehiclesContextType } from "../../@types/managevehicles";
import { ManageVehiclesContext } from "../../context/ManageVehiclesContext";

export const List_fancy = () => {

  const { powerUnitData } = useContext(ManageVehiclesContext) as ManageVehiclesContextType;

  const columns = useMemo<MRT_ColumnDef<IPowerUnit>[]>(
    () => [
      {
        accessorKey: "unit",
        header: "Unit #",
      },
      {
        accessorKey: "make",
        header: "Make",
      },
      {
        accessorKey: "vin",
        header: "VIN",
      },
      {
        accessorKey: "plate",
        header: "Plate",
      },
      {
        accessorKey: "subtype",
        header: "Vehicle Subtype",
      },
      {
        accessorKey: "isActive",
        header: "Active Permit",
      },
    ],
    []
  );

  return (
    <div className="table-container">
      <MaterialReactTable
        columns={columns}
        data={powerUnitData}
        muiTopToolbarProps={{
          // resolve z-index conflict with sliding panel
          sx: { zIndex: 0 }, 
        }}
        muiBottomToolbarProps={{
          // resolve z-index conflict with sliding panel
          sx: { zIndex: 0 },
        }}
        muiSearchTextFieldProps={{
          placeholder: "Search",
          sx: { 
            minWidth: "300px",
            backgroundColor: "white",
          },
          variant: "outlined",
          inputProps: {
            sx: {
              padding: "10px",
            },
            
          },          
        }}
        muiTableHeadRowProps={{
          sx: {backgroundColor: 'lightGrey'},
        }}
        enableColumnActions={false}
        enableRowSelection
        initialState={{
          showGlobalFilter: true, //show the global filter by default
        }}
        positionGlobalFilter="left"
        renderTopToolbar={({ table }) => (
          <Box sx={{
            display: 'flex',
            padding: '10px 0px',
            backgroundColor: '#F2F2F2'
          }}>
            <MRT_GlobalFilterTextField table={table}/>
            <CustomFilter table={table}/>
            <IconButton
              onClick={() => {
                alert("Delete Selected Accounts");
              }}
            >
              <i className="fa fa-trash"></i>
            </IconButton>
          </Box>
        )}
      />
    </div>
  );
};

const options = ["Truck Tractor", "Tandem", "Tridem"];
const ITEM_HEIGHT = 48;

export const CustomFilter = ({table} : {table: MRT_TableInstance<IPowerUnit>}) => {
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
        aria-controls={open ? "filter-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<i className="fa fa-filter"></i>}
        sx={{ margin: '0px 20px'}}
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
            onClick={() => {table.setColumnFilters([{id: 'subtype', value: option}])}}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
