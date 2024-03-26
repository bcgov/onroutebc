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
import { getDefaultCommodities } from "../../../../helpers/commodities";
import { PermitCommodity } from "../../../../types/PermitCommodity";

export const ConditionsTable = ({
  commoditiesInPermit,
  applicationWasCreated,
  permitType,
}: {
  commoditiesInPermit: PermitCommodity[];
  applicationWasCreated: boolean;
  permitType: PermitType;
}) => {
  const { control, setValue, resetField } = useFormContext();
  const defaultCommodities = getDefaultCommodities(permitType);
  const initialCommodities = !applicationWasCreated
    ? defaultCommodities // return default options for new application (not created one)
    : defaultCommodities.map((defaultCommodity) => {
      // Application exists at this point, thus select all commodities that were selected in the application
      const existingCommodity = commoditiesInPermit.find(
        (c) => c.condition === defaultCommodity.condition,
      );

      return {
        ...defaultCommodity,
        checked: existingCommodity
          ? existingCommodity.checked
          : defaultCommodity.checked,
      };
    });

  const [allCommodities, setAllCommodities] =
    useState<PermitCommodity[]>(initialCommodities);

  useEffect(() => {
    resetField("permitData.commodities", { defaultValue: [] }); // reset all commodities
    setValue(
      "permitData.commodities",
      allCommodities.filter((c) => c.checked),
    ); // select the commodities in the existing application
  }, [allCommodities]);

  const handleSelect = (checkedCondition: string) => {
    const newCommodities = allCommodities.map((commodity) => {
      if (commodity.condition === checkedCondition) {
        commodity.checked = !commodity.checked;
      }
      return commodity;
    });

    setAllCommodities(newCommodities);

    return newCommodities;
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
          {allCommodities.map((row) => (
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
