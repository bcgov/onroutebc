import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";

import "./ShoppingCartButton.scss";

export const ShoppingCartButton = ({
  cartItemCount,
}: {
  cartItemCount: number;
}) => {
  const onClick = () => {
    // Navigate to shopping cart page
  };

  return (
    <Button
      aria-label="cart"
      onClick={onClick}
      className="shopping-cart-button"
    >
      <FontAwesomeIcon
        icon={faShoppingCart}
        className="shopping-cart-button__icon"
      />

      <div className="shopping-cart-button__count">
        {cartItemCount}
      </div>
    </Button>
  );
};
