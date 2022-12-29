import { Button } from "@mui/material";
import { MRT_TableInstance } from "material-react-table";
import { IPowerUnit } from "../../@types/managevehicles";

export const FilterList = ({
  table,
  filters,
}: {
  filters: Array<{ id: string; value: unknown }>;
  table: MRT_TableInstance<IPowerUnit>;
}) => {

  const handleRemove = ({ id, val }: { id: string; val: string }) => {
    filters.forEach((parent) => {
      if (parent.id === id) {
        // cast sub option type as an array
        const arr = parent.value as Array<string>;
        arr.forEach((element) => {
          if (element === val) {
            const index = arr.indexOf(val);
            if (index > -1) {
              // only splice array when item is found
              arr.splice(index, 1);
            }
          }
        });
      }
    });

    table.setColumnFilters(filters);
  };

  return (
    <>
      {filters.map((f, index) => {
        const arr = f.value as Array<string>;
        return arr.map((val, i) => {
          const contents = `${f.id}: ${val}`;
          const id = f.id;
          return (
            <Button
              key={index + i}
              variant="contained"
              sx={{ marginBottom: "15px", marginRight: "15px" }}
              endIcon={<i className="fa fa-times"></i>}
              onClick={() => handleRemove({ id, val })}
            >
              {contents}
            </Button>
          );
        });
      })}
    </>
  );
};
