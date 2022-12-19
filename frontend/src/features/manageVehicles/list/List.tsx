import { useMemo } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import "./List.scss";
import { Box, IconButton } from "@mui/material";

type Vehicle = {
  unit: string;
  make: string;
  vin: string;
  plate: string;
  subtype: string;
  year: number;
  country: string;
  gvw: number;
  isActive: boolean;
};

const data: Vehicle[] = [
  {
    unit: "Ken10",
    make: "Kenworth",
    vin: "12345678",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
  },
  {
    unit: "Ken10",
    make: "Kenworth",
    vin: "12345678",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
  },
  {
    unit: "Ken10",
    make: "Kenworth",
    vin: "12345678",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
  },
];

export const List = () => {
  const columns = useMemo<MRT_ColumnDef<Vehicle>[]>(
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
        data={data}
        muiTopToolbarProps={{
          sx: { zIndex: 0 },
        }}
        muiBottomToolbarProps={{
          sx: { zIndex: 0 },
        }}
        muiSearchTextFieldProps={{
          placeholder: "Search all users",
          sx: { minWidth: "300px" },
          variant: "outlined",
          inputProps: {
            style: {
              padding: "10px",
            },
          },
        }}
        initialState={{
          showGlobalFilter: true, //show the global filter by default
        }}
        positionGlobalFilter="left"
        renderTopToolbar={({ table }) => (
          <Box>
            <MRT_GlobalFilterTextField table={table} />
            {/* add custom button to print table  */}
            <IconButton
              onClick={() => {
                alert("Delete Selected Accounts");
              }}
            >
              <i className="fa fa-trash"></i>
            </IconButton>
            {/* along-side built-in buttons in whatever order you want them */}
            <MRT_ToggleFiltersButton table={table} />
          </Box>
        )}
      />
    </div>
  );
};
