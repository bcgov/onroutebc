import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
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

import "./ConditionsTable.scss";
import { Commodities } from "../../../../types/application";
import { TROS_COMMODITIES } from "../../../../constants/termOversizeConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export const ConditionsTable = ({
  commodities,
  applicationWasCreated,
}: {
  commodities: Commodities[];
  applicationWasCreated: boolean;
}) => {
  const { control, setValue, resetField } = useFormContext();
  const [allOptions, setAllOptions] = useState<Commodities[]>([]);

  const getOptions = (
    applicationWasCreated: boolean,
    existingCommodities: Commodities[],
  ) => {
    const isMustSelectOption = (commodity: Commodities) =>
      commodity.condition === "CVSE-1000" ||
      commodity.condition === "CVSE-1070";

    const defaultOptions = TROS_COMMODITIES.map((commodity) => ({
      ...commodity,
      // must-select options are checked and disabled (for toggling) by default
      checked: isMustSelectOption(commodity),
      disabled: isMustSelectOption(commodity),
    }));

    if (!applicationWasCreated) return defaultOptions; // return default options for new application (not created one)
    // Application exists at this point, thus select all commodities that were selected in the application
    return defaultOptions.map((defaultCommodity) => {
      const existingCommodity = existingCommodities.find(
        (c) => c.condition === defaultCommodity.condition,
      );

      return {
        ...defaultCommodity,
        checked: existingCommodity
          ? existingCommodity.checked
          : defaultCommodity.checked,
      };
    });
  };

  useEffect(() => {
    const updatedCommodities = getOptions(applicationWasCreated, commodities);
    resetField("permitData.commodities", { defaultValue: [] }); // reset all options
    setValue(
      "permitData.commodities",
      updatedCommodities.filter((c) => c.checked),
    ); // select the commodities in the existing application
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
    setValue(
      "permitData.commodities",
      newOptions.filter((option) => option.checked),
    ); // then select the newly selected options

    return newOptions;
  }

  return (
    <TableContainer className="conditions-table" component={Paper}>
      <Table 
        className="conditions-table__table"
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell 
              className="conditions-table__header conditions-table__header--description"
            >
              Description
            </TableCell>

            <TableCell 
              className="conditions-table__header conditions-table__header--conditions"
            >
              Conditions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allOptions.map((row) => (
            <TableRow
              key={row.condition}
              className="conditions-table__row"
            >
              <TableCell
                className="conditions-table__cell conditions-table__cell--checkbox"
                component="th" 
                scope="row"
              >
                <FormControlLabel
                  control={
                    <Controller
                      name="permitData.commodities"
                      render={() => {
                        return (
                          <Checkbox
                            className={`conditions-table__checkbox ${row.disabled ? "conditions-table__checkbox--disabled" : ""}`}
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

              <TableCell 
                className="conditions-table__cell conditions-table__cell--condition"
                component="th" 
                scope="row"
              >
                <a
                  href={row.conditionLink}
                  className="condition-link"
                  data-testid="permit-condition-link"
                >
                  <span
                    className="condition-link__link"
                    data-testid="permit-condition-code"
                  >
                    {row.condition}
                  </span>
                  <FontAwesomeIcon
                    className="condition-link__icon"
                    icon={faArrowUpRightFromSquare}
                  />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
