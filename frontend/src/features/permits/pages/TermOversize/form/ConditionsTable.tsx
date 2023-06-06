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
import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TROS_COMMODITIES } from "../../../constants/termOversizeConstants";
import { Commodities } from "../../../types/application";

export const ConditionsTable = ({
  commodities,
  applicationWasCreated,
}: {
  commodities: Commodities[];
  applicationWasCreated: boolean;
}) => {
  const { control, setValue, resetField } = useFormContext();
  const [allOptions, setAllOptions] = useState<Commodities[]>([]);

  const getOptions = (applicationWasCreated: boolean, existingCommodities: Commodities[]) => {
    const isMustSelectOption = (commodity: Commodities) => 
      commodity.condition === "CVSE-1000" || commodity.condition === "CVSE-1070";

    const defaultOptions = TROS_COMMODITIES.map(commodity => ({
      ...commodity,
      // must-select options are checked and disabled (for toggling) by default
      checked: isMustSelectOption(commodity),
      disabled: isMustSelectOption(commodity),
    }));

    if (!applicationWasCreated) return defaultOptions; // return default options for new application (not created one)
    // Application exists at this point, thus select all commodities that were selected in the application
    return defaultOptions.map(defaultCommodity => {
      const existingCommodity = existingCommodities.find(c => 
        c.condition === defaultCommodity.condition
      );

      return {
        ...defaultCommodity,
        checked: existingCommodity ? existingCommodity.checked : defaultCommodity.checked,
      };
    });
  };

  useEffect(() => {
    const updatedCommodities = getOptions(applicationWasCreated, commodities);
    resetField("permitData.commodities", { defaultValue: [] }); // reset all options
    setValue("permitData.commodities", updatedCommodities.filter(c => c.checked)); // select the commodities in the existing application
    setAllOptions(updatedCommodities);
  }, [applicationWasCreated, commodities]);

  function handleSelect(checkedCondition: string) {
    const newOptions = allOptions.map((option) => {
      if (option.condition === checkedCondition) {
        option.checked = !option.checked;
      }
      return option;
    });

    setAllOptions(newOptions);
    resetField("permitData.commodities", { defaultValue: [] }); // reset all options first
    setValue("permitData.commodities", newOptions.filter(option => option.checked)); // then select the newly selected options

    return newOptions;
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
          {allOptions.map((row) => (
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
                            key={row.condition}
                            checked={row.checked}
                            disabled={row.disabled}
                            onChange={() => handleSelect(row.condition)}
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
                {row.condition}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
