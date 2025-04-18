import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog } from "@mui/material";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import "./EditCartItemDialog.scss";

export const EditCartItemDialog = ({
  shouldOpen,
  handleCancel,
  handleEdit,
}: {
  shouldOpen: boolean;
  handleCancel: () => void;
  handleEdit: () => Promise<void>;
}) => {
  return (
    <Dialog
      className="edit-cart-item-dialog"
      onClose={handleCancel}
      aria-labelledby="confirmation-dialog-title"
      open={shouldOpen}
    >
      <div className="edit-cart-item-dialog__header">
        <div className="edit-cart-item-dialog__icon">
          <FontAwesomeIcon
            className="icon"
            icon={faPen}
          />
        </div>

        <span className="edit-cart-item-dialog__title">
          Edit Application
        </span>
      </div>

      <div className="edit-cart-item-dialog__info">
        Editing a permit application that&apos;s in the cart will remove it from your cart. You will have to re-add it to your cart.
      </div>

      <div className="edit-cart-item-dialog__actions">
        <Button
          className="edit-cart-item-dialog__btn edit-cart-item-dialog__btn--cancel"
          variant="contained"
          color="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button
          className="edit-cart-item-dialog__btn edit-cart-item-dialog__btn--edit"
          variant="contained"
          color="primary"
          onClick={handleEdit}
        >
          Edit Application
        </Button>
      </div>
    </Dialog>
  );
};
