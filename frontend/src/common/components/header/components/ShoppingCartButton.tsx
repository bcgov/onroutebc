import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Badge, { BadgeProps } from '@mui/material/Badge';
import { IconButton, styled } from "@mui/material";

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid black`,
    padding: '0 4px',
  },
}));

export const ShoppingCartButton = ({cartItemCount} : {cartItemCount: number}) => {

  const onClick = () => {
    console.log('navigate to /shopping-cart');
  }

  return (
    <IconButton aria-label="cart" onClick={onClick}>
      <StyledBadge badgeContent={cartItemCount} color="secondary">
        <FontAwesomeIcon icon={faShoppingCart} color="white" />
      </StyledBadge>
    </IconButton>
  );
};
