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

import "./LOATable.scss";
import { LOADetail } from "../../../../../settings/types/SpecialAuthorization";
import { applyWhenNotNullable } from "../../../../../../common/helpers/util";
import { DATE_FORMATS, toLocal } from "../../../../../../common/helpers/formatDate";

interface SelectableLOA {
  loa: LOADetail;
  checked: boolean;
  disabled: boolean;
}

export const LOATable = ({
  loas,
  onSelectLOA,
}: {
  loas: SelectableLOA[];
  onSelectLOA: (loaId: string) => void;
}) => {
  return (
    <TableContainer className="loa-table" component={Paper}>
      <Table className="loa-table__table" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="loa-table__header loa-table__header--loa-number">
              LOA #
            </TableCell>

            <TableCell className="loa-table__header loa-table__header--expiry">
              Expiry Date
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loas.map((selectableLOA) => (
            <TableRow key={selectableLOA.loa.loaId} className="loa-table__row">
              <TableCell
                className="loa-table__cell loa-table__cell--loa-number"
                component="th"
                scope="row"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      className={`loa-table__checkbox ${
                        selectableLOA.disabled
                          ? "loa-table__checkbox--disabled"
                          : ""
                      }`}
                      key={selectableLOA.loa.loaId}
                      checked={selectableLOA.checked}
                      disabled={selectableLOA.disabled}
                      onChange={() => onSelectLOA(selectableLOA.loa.loaId)}
                    />
                  }
                  key={selectableLOA.loa.loaNumber}
                  label={selectableLOA.loa.loaNumber}
                />
              </TableCell>

              <TableCell
                className="loa-table__cell loa-table__cell--expiry"
                component="th"
                scope="row"
              >
                {applyWhenNotNullable(
                  expiryDate => toLocal(expiryDate, DATE_FORMATS.DATEONLY_SLASH),
                  selectableLOA.loa.expiryDate,
                  "Never expires",
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
