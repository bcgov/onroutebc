import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog } from "@mui/material";

import "./UpdateCartDialog.scss";

export const UpdateCartDialog = ({
  shouldOpen,
  onUpdateCart,
}: {
  shouldOpen: boolean;
  onUpdateCart: () => void;
}) => {
  return (
    <Dialog
      className="update-cart-dialog"
      onClose={onUpdateCart}
      aria-labelledby="confirmation-dialog-title"
      open={shouldOpen}
    >
      <div className="update-cart-dialog__header">
        <div className="update-cart-dialog__icon">
          <FontAwesomeIcon
            className="icon"
            icon={faCartShopping}
          />
        </div>

        <span className="update-cart-dialog__title">
          Update Shopping Cart
        </span>
      </div>

      <div className="update-cart-dialog__info">
        Some items in your shopping cart have changed. Click Update Cart to continue.
      </div>

      <div className="update-cart-dialog__actions">
        <Button
          className="update-cart-dialog__btn"
          variant="contained"
          color="primary"
          onClick={onUpdateCart}
        >
          Update Cart
        </Button>
      </div>
    </Dialog>
  );
};
