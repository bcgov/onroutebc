import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

import "./RemoveUsersModal.scss";
import {
  useGetCreditAccountQuery,
  useRemoveCreditAccountUsersMutation,
} from "../../hooks/creditAccount";

/**
 *  A stateless confirmation dialog box for remove Operations.
 */
export const RemoveUsersModal = ({
  isOpen,
  onCancel,
  onConfirm,
  userIds,
}: {
  /**
   * Boolean to control the open and close state of Dialog box.
   */
  isOpen: boolean;
  /**
   * A callback function on clicking cancel button.
   * @returns void
   */
  onCancel: () => void;
  onConfirm: () => void;
  userIds: number[];
}) => {
  const { data: creditAccount } = useGetCreditAccountQuery();

  const removeCreditAccountUsersMutation = creditAccount?.creditAccountId
    ? useRemoveCreditAccountUsersMutation({
        creditAccountId: creditAccount?.creditAccountId,
        companyIds: userIds,
      })
    : undefined;

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };

  const handleRemoveUsers = async () => {
    if (removeCreditAccountUsersMutation) {
      const { status } = await removeCreditAccountUsersMutation.mutateAsync();

      if (isActionSuccessful(status)) {
        onConfirm();
      }
    }
  };

  return (
    <div>
      <Dialog
        className="remove-user-dialog"
        onClose={onCancel}
        aria-labelledby="confirmation-dialog-title"
        open={isOpen}
      >
        <DialogTitle className="remove-user-dialog__title">
          <span className="remove-user-dialog__icon">
            <FontAwesomeIcon icon={faMinus} />
          </span>{" "}
          &nbsp;
          <strong>Remove User(s)? </strong>
        </DialogTitle>

        <DialogContent className="remove-user-dialog__content" dividers>
          <Typography className="remove-user-dialog__msg" gutterBottom>
            Are you sure you want to remove credit account user(s)?
          </Typography>
        </DialogContent>

        <DialogActions className="remove-user-dialog__actions">
          <Button
            className="remove-user-btn remove-user-btn--cancel"
            variant="contained"
            color="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className="remove-user-btn remove-user-btn--delete"
            variant="contained"
            color="error"
            onClick={handleRemoveUsers}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
