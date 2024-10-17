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
  permitType,
  includeLcvCondition = false,
  onSetConditions,
}: {
  conditionsInPermit: PermitCondition[];
  permitType: PermitType;
  includeLcvCondition?: boolean;
  onSetConditions: (conditions: PermitCondition[]) => void;
}) => {
  const defaultConditions = getDefaultConditions(permitType, includeLcvCondition);
  const allConditions = defaultConditions.map((defaultCondition) => {
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

  const handleSelect = (checkedCondition: string) => {
    const updatedConditions = allConditions.map((condition) => {
      if (condition.condition === checkedCondition) {
        condition.checked = !condition.checked;
      }
      return condition;
    }).filter(condition => condition.checked);

    onSetConditions(updatedConditions);
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
                component="td"
                scope="row"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      className={`condition-checkbox ${
                        row.disabled
                          ? "condition-checkbox--disabled"
                          : ""
                      }`}
                      key={row.condition}
                      checked={row.checked}
                      disabled={row.disabled}
                      onChange={() => handleSelect(row.condition)}
                    />
                  }
                  key={row.description}
                  label={row.description}
                  classes={{
                    root: "conditions-table__form-control",
                    disabled: "conditions-table__form-control conditions-table__form-control--disabled",
                  }}
                  slotProps={{
                    typography: {
                      className: "condition-description",
                    },
                  }}
                />
              </TableCell>

              <TableCell
                className="conditions-table__cell conditions-table__cell--condition"
                component="td"
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
