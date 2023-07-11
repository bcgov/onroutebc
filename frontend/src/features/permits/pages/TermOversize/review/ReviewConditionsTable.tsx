import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import { Commodities, Application } from "../../../types/application";
import "./ReviewConditionsTable.scss";

export const ReviewConditionsTable = ({
  values,
}: {
  values: Application | undefined;
}) => {
  return (
    <TableContainer>
      <Table className="review-conditions-table" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="review-conditions-table__header">Description</TableCell>
            <TableCell className="review-conditions-table__header">Conditions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values?.permitData.commodities.map((row: Commodities) => {
            return (
              <TableRow
                className="review-conditions-table__row"
                key={row.condition}
              >
                <TableCell component="td" scope="row">
                  <Checkbox
                    className="checkbox"
                    key={row.condition}
                    checked={true}
                    disabled={true}
                  />
                  {row.description}
                </TableCell>

                <TableCell component="td" scope="row">
                  <a href={row.conditionLink} className="condition-link">
                    {row.condition}<FontAwesomeIcon className="condition-link__icon" icon={faArrowUpRightFromSquare} />
                  </a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
