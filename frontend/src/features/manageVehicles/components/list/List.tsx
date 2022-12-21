import { useMemo, useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Options } from "../options/Options";
import { IPowerUnit, ManageVehiclesContextType } from "../../@types/managevehicles";
import { useContext } from "react";
import { ManageVehiclesContext } from "../../context/ManageVehiclesContext";

export const List = () => {

  const { powerUnitData } = useContext(ManageVehiclesContext) as ManageVehiclesContextType;

  const [rows] = useState<IPowerUnit[]>(powerUnitData);
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
      <Options />
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
