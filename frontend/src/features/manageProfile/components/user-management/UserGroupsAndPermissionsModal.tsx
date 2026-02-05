import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { GreenCheckIcon } from "../../../../common/components/icons/GreenCheckIcon";
import { RedXMarkIcon } from "../../../../common/components/icons/RedXMarkIcon";

/**
 *  A stateless modal that displays the user groups and permissions for CV Clients.
 */
export default function UserGroupsAndPermissionsModal({
  isOpen,
  onClickClose,
}: Readonly<{
  /**
   * Boolean to control the open and close state of Dialog box.
   */
  isOpen: boolean;
  /**
   * A callback function on clicking cancel button.
   * @returns void
   */
  onClickClose: () => void;
}>) {
  return (
    <div>
      <Dialog
        onClose={onClickClose}
        aria-labelledby="confirmation-dialog-title"
        open={isOpen}
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            background: BC_COLOURS.bc_background_light_grey,
            color: BC_COLOURS.bc_red,
          }}
        >
          <FontAwesomeIcon icon={faUserGroup} /> &nbsp;
          <strong>User Groups and Permissions</strong>
          <IconButton
            aria-label="close"
            onClick={onClickClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table aria-label="groups and permissions table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Permissions</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Administrator</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Permit Applicant</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key="permits">
                  <TableCell size="medium" component="th" scope="row">
                    <Stack spacing={2}>
                      <span>
                        <strong>Permits</strong>
                      </span>
                      <span>All functions</span>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={2}>
                      <span>&nbsp;</span>
                      <span>
                        <GreenCheckIcon />
                      </span>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={2}>
                      <span>&nbsp;</span>
                      <GreenCheckIcon />
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow key="manage-vehicle-inventory">
                  <TableCell component="th" scope="row">
                    <Stack spacing={2}>
                      <span>
                        <strong>Manage Vehicle Inventory</strong>
                      </span>
                      <span>All functions</span>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={2}>
                      <span>&nbsp;</span>
                      <GreenCheckIcon />
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={2}>
                      <span>&nbsp;</span>
                      <GreenCheckIcon />
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow key="manage-company-information">
                  <TableCell component="th" scope="row">
                    <Stack spacing={2}>
                      <span>
                        <strong>Manage Client Information</strong>
                      </span>
                      <span>View Profile</span>
                      <span>Update profile information</span>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={2}>
                      <span>&nbsp;</span>
                      <GreenCheckIcon />
                      <GreenCheckIcon />
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={2}>
                      <span>&nbsp;</span>
                      <GreenCheckIcon />
                      <RedXMarkIcon />
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow key="manage-company-users">
                  <TableCell component="th" scope="row">
                    <Stack spacing={2}>
                      <span>
                        <strong>Manage Company Users</strong>
                      </span>
                      <span>All functions</span>
                      <span>Update my own user profile information</span>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={2}>
                      <span>&nbsp;</span>
                      <GreenCheckIcon />
                      <GreenCheckIcon />
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={2}>
                      <span>&nbsp;</span>
                      <RedXMarkIcon />
                      <GreenCheckIcon />
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
