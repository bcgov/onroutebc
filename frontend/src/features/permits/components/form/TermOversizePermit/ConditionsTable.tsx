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

export const ConditionsTable = () => {
  const conditions = [
    {
      description: "General Permit Conditions",
      condition: "CVSE-1000",
      conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251",
      checked: true,
    },
    {
      description: "Permit Scope and Limitation",
      condition: "CVSE-1070",
      conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
      checked: true,
    },
    {
      description: "Supplement for Structures",
      condition: "CVSE-1000S",
      conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1255",
      checked: false,
    },
    {
      description: "Log Permit Conditions",
      condition: "CVSE-1000L",
      conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1250",
      checked: false,
    },
    {
      description: "Routes - Woods Chips & Residual",
      condition: "CVSE-1012",
      conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1259",
      checked: false,
    },
    {
      description: "Restricted Routes for Hauling Wood on Wide Bunks",
      condition: "CVSE-1013",
      conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1254",
      checked: false,
    },
    {
      description: "Hay",
      condition: "HAY (hay bales)",
      conditionLink:
        "https://www.cvse.ca/ctpm/com_circulars/2012/120803_comp_cc_0912_changes_hay_bales.pdf",
      checked: false,
    },
    {
      description: "Stinger Steered Transport",
      condition: "SST (Stinger Steered Transporters)",
      conditionLink:
        "https://www.cvse.ca/CTPM/Com_Circulars/2017/171227-comp-cc_08-2107-Stinger-Steered-Car-Carrier.pdf",
      checked: false,
    },
  ];

  const [checkedValues, setCheckedValues] = useState(conditions);
  const { control, setValue } = useFormContext();

  function handleSelect(checkedName: string) {
    const newNames = checkedValues?.map((item) => {
      if (item.description === checkedName) {
        item.checked = !item.checked;
      }
      return item;
    });

    setCheckedValues(newNames);
    setValue("permitDetails.commodities", newNames);

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
                      name="permitDetails.commodities"
                      render={() => {
                        return (
                          <Checkbox
                            key={row.description}
                            checked={row.checked}
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
