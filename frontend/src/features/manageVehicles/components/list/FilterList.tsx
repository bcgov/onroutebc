import { Button } from "@mui/material";
import { ColumnFiltersState } from "@tanstack/table-core";
import { MRT_TableInstance } from "material-react-table";
import { IPowerUnit } from "../../@types/managevehicles";

export const FilterList = ({
  table,
  filters,
}: {
  table: MRT_TableInstance<IPowerUnit>;
  filters: ColumnFiltersState;
}) => {

  //table.setColumnFilters(filters);

  return (
    <>
      {filters.map((f, index) => {
        const contents = `${f.id}: ${f.value}`;
        return (
          <Button key={index} variant="contained" sx={{ marginBottom: "15px" }}>
            {contents}
          </Button>
        );
      })}
    </>
  );
};
