import { useMemo, useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { OptionsBar } from "./OptionsBar";

type Vehicle = {
  id: number;
  unit: string;
  make: string;
  vin: string;
  plate: string;
  subtype: string;
  year: number;
  country: string;
  gvw: number;
  isActive: boolean;
  dateCreated: string;
};

const data: Vehicle[] = [
  {
    id: 1,
    unit: "Ken10",
    make: "Kenworth",
    vin: "12345678",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
    dateCreated: "2022-12-19",
  },
  {
    id: 2,
    unit: "Ten10",
    make: "Kenworth",
    vin: "321",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
    dateCreated: "2022-12-19",
  },
  {
    id: 3,
    unit: "Ken14",
    make: "Kenworth",
    vin: "543",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
    dateCreated: "2022-12-19",
  },
];

export default function BasicTable() {
  const [rows] = useState<Vehicle[]>(data);
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState<number | string>("");

  console.log(rowId);

  const columns = useMemo(
    () => [
      {
        field: "unit",
        headerName: "Unit #",
        width: 120,
        sortable: false,
        filterable: false,
      },
      { field: "make", headerName: "Make", width: 170 },
      { field: "vin", headerName: "VIN", width: 200 },
      {
        field: "plate",
        headerName: "Plate",
        width: 100,
        type: "singleSelect",
        valueOptions: ["basic", "editor", "admin"],
        editable: true,
      },
      {
        field: "subtype",
        headerName: "Vehicle Type",
        width: 200,
        editable: true,
      },
      {
        field: "dateCreated",
        headerName: "Date Created",
        width: 150,
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <OptionsBar />
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        disableColumnMenu
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        checkboxSelection
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
    </Box>
  );
}
