import { Button } from "@mui/material";
import { ColumnFiltersState } from "@tanstack/table-core";

export const FilterList = ({ filters }: { filters: ColumnFiltersState }) => {
  return (
    <>
      {filters.map((f, index) => {
        const arr = f.value as Array<any>;
        return arr.map((val, i) => {
          const contents = `${f.id}: ${val}`;
          return (
            <Button
              key={index + i}
              variant="contained"
              sx={{ marginBottom: "15px", marginRight: "15px" }}
            >
              {contents}
            </Button>
          );
        });
      })}
    </>
  );
};
