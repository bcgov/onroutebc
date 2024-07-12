import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import {
  useGetCreditAccountQuery,
  useRemoveCreditAccountUsersMutation,
} from "../../hooks/creditAccount";
import "./RemoveUsersModal.scss";

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

  const { mutateAsync, isPending } = useRemoveCreditAccountUsersMutation();

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };

  const handleRemoveUsers = async () => {
    if (creditAccount?.creditAccountId) {
      const { status } = await mutateAsync({
        creditAccountId: creditAccount.creditAccountId,
        companyIds: userIds,
      });

      if (isActionSuccessful(status)) {
        onConfirm();
      }
    }
  };

  return (
    <Dialog
      className="remove-users-modal"
      open={isOpen}
      onClose={onCancel}
      PaperProps={{
        className: "remove-users-modal__container",
      }}
    >
      <div className="remove-users-modal__header">
        <div className="remove-users-modal__icon">
          <FontAwesomeIcon className="icon" icon={faMinus} />
        </div>
        <h2 className="remove-users-modal__title">Remove User(s)? </h2>
      </div>

      <div className="remove-users-modal__body">
        <Typography className="remove-users-modal__text">
          Are you sure you want to remove credit account user(s)?
        </Typography>
      </div>

      <div className="remove-users-modal__footer">
        <Button
          className="remove-users-btn remove-users-btn--cancel"
          variant="contained"
          color="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          className="remove-users-btn remove-users-btn--confirm"
          variant="contained"
          color="error"
          onClick={handleRemoveUsers}
          disabled={isPending}
        >
          Remove User
        </Button>
      </div>
    </Dialog>
  );
};
