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
import { CustomExternalLink } from "../../../../../../common/components/links/CustomExternalLink";
import { PermitType } from "../../../../types/PermitType";
import { getDefaultConditions } from "../../../../helpers/conditions";
import { PermitCondition } from "../../../../types/PermitCondition";

export const ConditionsTable = ({
  conditionsInPermit,
  applicationWasCreated,
  permitType,
  includeLcvCondition = false,
}: {
  conditionsInPermit: PermitCondition[];
  applicationWasCreated: boolean;
  permitType: PermitType;
  includeLcvCondition?: boolean;
}) => {
  const { control, setValue, resetField } = useFormContext();
  const defaultConditions = getDefaultConditions(permitType, includeLcvCondition);
  const initialConditions = !applicationWasCreated
    ? defaultConditions // return default options for new application (not created one)
    : defaultConditions.map((defaultCondition) => {
      // Application exists at this point, thus select all conditions that were selected in the application
      const existingCondition = conditionsInPermit.find(
        (c) => c.condition === defaultCondition.condition,
      );

      return {
        ...defaultCondition,
        checked: existingCondition
          ? existingCondition.checked
          : defaultCondition.checked,
      };
    });

  const [allConditions, setAllConditions] =
    useState<PermitCondition[]>(initialConditions);

  useEffect(() => {
    resetField("permitData.commodities", { defaultValue: [] }); // reset all conditions
    setValue(
      "permitData.commodities",
      allConditions.filter((c) => c.checked),
    ); // select the conditions in the existing application
  }, [allConditions]);

  useEffect(() => {
    setAllConditions(initialConditions);
  }, [initialConditions]);

  const handleSelect = (checkedCondition: string) => {
    const newConditions = allConditions.map((condition) => {
      if (condition.condition === checkedCondition) {
        condition.checked = !condition.checked;
      }
      return condition;
    });

    setAllConditions(newConditions);

    return newConditions;
  }

  return (
    <TableContainer className="conditions-table" component={Paper}>
      <Table className="conditions-table__table" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="conditions-table__header conditions-table__header--description">
              Description
            </TableCell>

            <TableCell className="conditions-table__header conditions-table__header--conditions">
              Conditions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {allConditions.map((row) => (
            <TableRow key={row.condition} className="conditions-table__row">
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
                            className={`conditions-table__checkbox ${
                              row.disabled
                                ? "conditions-table__checkbox--disabled"
                                : ""
                            }`}
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
                <CustomExternalLink
                  href={row.conditionLink}
                  className="condition-link"
                  data-testid="permit-condition-link"
                  withLinkIcon={true}
                >
                  <span
                    className="condition-link__link"
                    data-testid="permit-condition-code"
                  >
                    {row.condition}
                  </span>
                </CustomExternalLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
