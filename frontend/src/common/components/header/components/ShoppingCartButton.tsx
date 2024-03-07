import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Badge from '@mui/material/Badge';
import { IconButton } from "@mui/material";
import "./ShoppingCartButton.scss";

export const ShoppingCartButton = ({cartItemCount} : {cartItemCount: number}) => {

  const onClick = () => {
    // TODO: useNavigate to the /shopping-cart
  }

  return (
    <IconButton aria-label="cart" onClick={onClick} className={"shopping-cart-button"}>
      <Badge badgeContent={cartItemCount} color="secondary" className={"shopping-cart-button__badge"}>
        <FontAwesomeIcon icon={faShoppingCart} color="white" className={"shopping-cart-button__icon"} />
      </Badge>
    </IconButton>
  );
};
