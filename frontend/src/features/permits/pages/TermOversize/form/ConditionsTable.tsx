import {
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TROS_COMMODITIES } from "../../../constants/termOversizeConstants";

export const ConditionsTable = () => {
  const [checkedValues, setCheckedValues] = useState(TROS_COMMODITIES);
  const { control, setValue } = useFormContext();

  function handleSelect(checkedName: string) {
    const newNames = checkedValues?.map((item) => {
      if (item.description === checkedName) {
        item.checked = !item.checked;
      }
      return item;
    });

    const checkedNames = checkedValues
      .filter((x) => x.checked)
      .map((y) => {
        return {
          description: y.description,
          condition: y.condition,
          conditionLink: y.conditionLink,
          checked: y.checked,
        };
      });

    setCheckedValues(newNames);
    setValue("permitData.commodities", checkedNames);

    return newNames;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Conditions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checkedValues.map((row) => (
            <TableRow
              key={row.condition}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                <FormControlLabel
                  control={
                    <Controller
                      name="permitData.commodities"
                      render={() => {
                        return (
                          <Checkbox
                            key={row.description}
                            checked={row.checked}
                            disabled={row.disabled}
                            onChange={() => handleSelect(row.description)}
                          />
                        );
                      }}
                      control={control}
                    />
                  }
                  key={row.description}
                  label={row.description}
                />
              </TableCell>

              <TableCell component="th" scope="row">
                <a href={row.conditionLink}>{row.condition}</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
