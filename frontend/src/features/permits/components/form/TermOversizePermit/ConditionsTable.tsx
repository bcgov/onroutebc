import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const ConditionsTable = () => {
  const conditions = [
    { description: "General Permit Conditions", condition: "CVSE-1000" },
    { description: "Permit Scope and Limitation", condition: "CVSE-1070" },
    { description: "Supplement for Structures", condition: "CVSE-10005" },
    {
      description: "Log Permit Conditions",
      condition: "CVSE-1000L LOG (logs as commodity)",
    },
    { description: "Routes - Woods Chips & Residual", condition: "CVSE-1012" },
    {
      description: "Restricted Routes for Hauling Wood on Wide Bunks",
      condition: "CVSE-1013",
    },
    { description: "Hay", condition: "HAY (hay bales)" },
    {
      description: "Stinger Steered Transport",
      condition: "SST (Stinger Steered Transporters)",
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Conditions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conditions.map((row) => (
            <TableRow
              key={row.condition}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.description}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.condition}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
