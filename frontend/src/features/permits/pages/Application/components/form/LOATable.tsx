import dayjs from "dayjs";
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

import "./LOATable.scss";
import { LOADetail } from "../../../../../settings/types/SpecialAuthorization";
import { applyWhenNotNullable } from "../../../../../../common/helpers/util";
import { DATE_FORMATS, toLocal } from "../../../../../../common/helpers/formatDate";
import { minDurationForPermitType } from "../../../../helpers/dateSelection";

export const LOATable = ({
  selectableLOAs,
}: {
  selectableLOAs: LOADetail[];
}) => {
  const { control, setValue, watch } = useFormContext();
  const currentSelectedLOAs: LOADetail[] = watch("permitData.selectedLoas");
  const permitType = watch("permitType");
  const minDuration = minDurationForPermitType(permitType);
  const startDate = watch("permitData.startDate");
  const minPermitExpiryDate = dayjs(startDate).add(minDuration, "day");
  const loasForTable = selectableLOAs.map(loa => ({
    ...loa,
    checked: currentSelectedLOAs.map(selectedLOA => selectedLOA.loaId).includes(loa.loaId),
    disabled: Boolean(loa.expiryDate) && minPermitExpiryDate.isAfter(loa.expiryDate),
  }));

  const handleSelectLOA = (loaId: string) => {
    const loa = loasForTable.find(loaRow => loaRow.loaId === loaId);
    if (!loa || loa?.disabled) return;

    const isLOASelected = Boolean(loa?.checked);
    if (isLOASelected) {
      // Deselect the LOA
      setValue(
        "permitData.selectedLoas",
        currentSelectedLOAs.filter(selectedLOA => selectedLOA.loaId !== loaId),
      );
    } else {
      // Select the LOA
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { checked, disabled, ...loaToSelect } = loa;
      setValue("permitData.selectedLoas", [...currentSelectedLOAs, loaToSelect]);
    }
  };

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
          {loasForTable.map((loa) => (
            <TableRow key={loa.loaId} className="loa-table__row">
              <TableCell
                className="loa-table__cell loa-table__cell--loa-number"
                component="th"
                scope="row"
              >
                <FormControlLabel
                  control={
                    <Controller
                      name="permitData.selectedLoas"
                      render={() => {
                        return (
                          <Checkbox
                            className={`loa-table__checkbox ${
                              loa.disabled
                                ? "loa-table__checkbox--disabled"
                                : ""
                            }`}
                            key={loa.loaId}
                            checked={loa.checked}
                            disabled={loa.disabled}
                            onChange={() => handleSelectLOA(loa.loaId)}
                          />
                        );
                      }}
                      control={control}
                    />
                  }
                  key={loa.loaNumber}
                  label={loa.loaNumber}
                />
              </TableCell>

              <TableCell
                className="loa-table__cell loa-table__cell--expiry"
                component="th"
                scope="row"
              >
                {applyWhenNotNullable(
                  expiryDate => toLocal(expiryDate, DATE_FORMATS.DATEONLY_SLASH),
                  loa.expiryDate,
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
