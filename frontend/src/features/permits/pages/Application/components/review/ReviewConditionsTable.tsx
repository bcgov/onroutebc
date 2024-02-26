import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from "@mui/material";

import { Commodities } from "../../../../types/application";
import "./ReviewConditionsTable.scss";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { CustomExternalLink } from "../../../../../../common/components/links/CustomExternalLink";

export const ReviewConditionsTable = ({
  conditions,
}: {
  conditions?: Commodities[];
}) => {
  const commodities = getDefaultRequiredVal([], conditions);

  return (
    <TableContainer>
      <Table className="review-conditions-table" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="review-conditions-table__header">
              Description
            </TableCell>
            <TableCell className="review-conditions-table__header">
              Conditions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commodities.map((row: Commodities) => {
            return (
              <TableRow
                className="review-conditions-table__row"
                key={row.condition}
                data-testid="review-permit-condition"
              >
                <TableCell component="td" scope="row">
                  <Checkbox
                    className="checkbox"
                    key={row.condition}
                    checked={true}
                    disabled={true}
                  />
                  <span data-testid="permit-condition-description">
                    {row.description}
                  </span>
                </TableCell>

                <TableCell component="td" scope="row">
                  <CustomExternalLink
                    href={row.conditionLink}
                    className="condition-link"
                    data-testid="permit-condition-link"
                    withLinkIcon={true}
                  >
                    <span data-testid="permit-condition-code">
                      {row.condition}
                    </span>
                  </CustomExternalLink>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
