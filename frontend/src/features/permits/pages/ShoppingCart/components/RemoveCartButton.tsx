import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";

import "./RemoveCartButton.scss";

export const RemoveCartButton = ({
  onRemove,
  isDisabled,
}: {
  onRemove: () => Promise<void>;
  isDisabled?: boolean;
}) => {
  const handleRemove = () => {
    if (!isDisabled) {
      onRemove();
    }
  };

  return (
    <Button
      className="remove-cart-button shopping-cart__remove-btn"
      classes={{
        disabled: "remove-cart-button--disabled remove-cart-button--readonly",
      }}
      key="remove-cart-button"
      aria-label="Remove from cart"
      variant="contained"
      color="tertiary"
      disabled={isDisabled}
      onClick={handleRemove}
    >
      <FontAwesomeIcon
        className="remove-cart-button__icon"
        icon={faTrashCan}
      />

      <span className="remove-cart-button__text">
        Remove from cart
      </span>
    </Button>
  );
};
