import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from "@mui/material";
import {
  TermOversizeApplication,
  Commodities,
} from "../../../types/application";

export const ReviewConditionsTable = ({
  values,
}: {
  values: TermOversizeApplication | undefined;
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Conditions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values?.application.commodities.map((row: Commodities) => {
            return (
              <TableRow
                key={row.condition}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <Checkbox
                    key={row.condition}
                    checked={true}
                    disabled={true}
                  />
                  {row.description}
                </TableCell>

                <TableCell component="th" scope="row">
                  <a href={row.conditionLink}>{row.condition}</a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
