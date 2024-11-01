import { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import "./AddTrailer.scss";
import { CustomSelectDisplayProps } from "../../../../../../../common/types/formElements";
import { useMemoizedArray } from "../../../../../../../common/hooks/useMemoizedArray";
import { VehicleInConfiguration } from "../../../../../types/PermitVehicleConfiguration";
import { VehicleSubType } from "../../../../../../manageVehicles/types/Vehicle";
import { getDefaultRequiredVal } from "../../../../../../../common/helpers/util";

const DEFAULT_EMPTY_SUBTYPE = "-";

export const AddTrailer = ({
  selectedTrailerSubtypes,
  trailerSubtypeOptions,
  trailerSubtypesMap,
  onUpdateVehicleConfigTrailers,
}: {
  selectedTrailerSubtypes: string[];
  trailerSubtypeOptions: {
    value: string;
    label: string;
  }[];
  trailerSubtypesMap: VehicleSubType[];
  onUpdateVehicleConfigTrailers: (updatedTrailerSubtypes: VehicleInConfiguration[]) => void;
}) => {
  const [trailerSelection, setTrailerSelection] = useState<string>(DEFAULT_EMPTY_SUBTYPE);

  const subtypeOptions = useMemoizedArray(
    [{ value: DEFAULT_EMPTY_SUBTYPE, label: "Select" }].concat(trailerSubtypeOptions),
    (option) => option.value,
    (option1, option2) => option1.value === option2.value && option1.label === option2.label,
  );

  const selectedSubtypesDisplay = useMemoizedArray(
    selectedTrailerSubtypes.map(subtype => getDefaultRequiredVal(
      subtype,
      trailerSubtypesMap.find(({ typeCode }) => typeCode === subtype)?.type),
    ),
    (selectedSubtype) => selectedSubtype,
    (subtype1, subtype2) => subtype1 === subtype2,
  );

  const handleAddTrailerSubtype = (subtype: string) => {
    if (subtype !== DEFAULT_EMPTY_SUBTYPE) {
      onUpdateVehicleConfigTrailers(selectedTrailerSubtypes.map(addedSubtype => ({
        vehicleSubType: addedSubtype,
      })).concat([{ vehicleSubType: subtype }]));

      setTrailerSelection(DEFAULT_EMPTY_SUBTYPE);
    }
  };

  const handleResetTrailerConfig = () => {
    onUpdateVehicleConfigTrailers([]);
  };

  return (
    <div className="add-trailer">
      <h4 className="add-trailer__title">Add Trailer(s)</h4>

      {selectedSubtypesDisplay.length > 0 ? (
        <div className="add-trailer__trailer-list">
          <TableContainer className="trailer-list" component={Paper}>
            <Table className="trailer-list__table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="trailer-list__header">
                    Vehicle Sub-type
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedSubtypesDisplay.map((subtype) => (
                  <TableRow key={subtype} className="trailer-list__row">
                    <TableCell
                      className="trailer-list__cell"
                      component="td"
                      scope="row"
                    >
                      {subtype}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            key="reset-trailer-config-button"
            className="add-trailer__reset-btn"
            aria-label="Reset Trailer Configuration"
            variant="contained"
            color="tertiary"
            onClick={handleResetTrailerConfig}
            data-testid="reset-trailer-config-button"
          >
            Reset Trailer Configuration
          </Button>
        </div>
      ) : null}

      {trailerSubtypeOptions.length > 0 ? (
        <FormControl
          className="add-trailer__input form-control"
          margin="normal"
        >
          <FormLabel
            id="add-trailer-form-control-label"
            classes={{
              root: "form-control__label",
              focused: "form-control__label--focused",
            }}
          >
            Add Trailer
          </FormLabel>

          <Select
            aria-labelledby={`add-trailer-form-control-label`}
            className={`form-control__select`}
            inputProps={{
              "aria-label": "Add Trailer",
            }}
            onChange={(e) => handleAddTrailerSubtype(e.target.value)}
            value={trailerSelection}
            MenuProps={{
              className: "form-control__menu",
              disablePortal: true,
            }}
            SelectDisplayProps={
              {
                "data-testid": `trailer-subtype-input-container`,
                className: "form-control__input-container",
              } as CustomSelectDisplayProps
            }
          >
            {subtypeOptions.map(({ value, label }) => (
              <MenuItem
                key={value}
                value={value}
                data-testid="add-trailer-menu-item"
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
    </div>
  );
};
