import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./ShoppingCartButton.scss";
import { SHOPPING_CART_ROUTES } from "../../../../routes/constants";

export const ShoppingCartButton = ({
  cartItemCount,
}: {
  cartItemCount: number;
}) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(SHOPPING_CART_ROUTES.DETAILS());
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
