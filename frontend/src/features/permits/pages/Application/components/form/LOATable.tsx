import {
  FormControlLabel,
  Paper,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import "./LOATable.scss";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { DATE_FORMATS, toLocal } from "../../../../../../common/helpers/formatDate";
import { SelectableLOA } from "../../../../types/PermitLOA";
import { Nullable } from "../../../../../../common/types/common";

const DEFAULT_EMPTY_LOA_NUMBER = 0;

export const LOATable = ({
  loas,
  onSelectLOA,
}: {
  loas: SelectableLOA[];
  onSelectLOA?: (loaNumber?: Nullable<number>) => void;
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
            <TableRow
              key={getDefaultRequiredVal(
                DEFAULT_EMPTY_LOA_NUMBER,
                selectableLOA.loa?.loaNumber,
              )}
              className="loa-table__row"
            >
              <TableCell
                className="loa-table__cell loa-table__cell--loa-number"
                component="td"
                scope="row"
              >
                <FormControlLabel
                  control={
                    <Radio
                      className={`loa-checkbox ${
                        selectableLOA.disabled
                          ? "loa-checkbox--disabled"
                          : ""
                      }`}
                      key={getDefaultRequiredVal(
                        DEFAULT_EMPTY_LOA_NUMBER,
                        selectableLOA.loa?.loaNumber,
                      )}
                      checked={selectableLOA.checked}
                      disabled={selectableLOA.disabled}
                      onChange={() => onSelectLOA?.(selectableLOA.loa?.loaNumber)}
                    />
                  }
                  key={getDefaultRequiredVal(
                    DEFAULT_EMPTY_LOA_NUMBER,
                    selectableLOA.loa?.loaNumber,
                  )}
                  label={applyWhenNotNullable(
                    (loaNum) => `${loaNum}`,
                    selectableLOA.loa?.loaNumber,
                    DEFAULT_EMPTY_LOA_NUMBER,
                  )}
                  classes={{
                    root: "loa-table__form-control",
                    disabled: "loa-table__form-control loa-table__form-control--disabled",
                  }}
                  slotProps={{
                    typography: {
                      className: "loa-number",
                    },
                  }}
                />
              </TableCell>

              <TableCell
                className="loa-table__cell loa-table__cell--expiry"
                component="td"
                scope="row"
              >
                {applyWhenNotNullable(
                  expiryDate => toLocal(expiryDate, DATE_FORMATS.DATEONLY_SLASH, true),
                  selectableLOA.loa?.expiryDate,
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
