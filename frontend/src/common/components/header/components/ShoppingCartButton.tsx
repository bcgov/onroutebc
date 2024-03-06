import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Badge, { BadgeProps } from '@mui/material/Badge';

import "./ShoppingCartButton.scss";
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
  return (
    <IconButton aria-label="cart">
      <StyledBadge badgeContent={cartItemCount} color="secondary">
        <FontAwesomeIcon icon={faShoppingCart} color="white" />
      </StyledBadge>
    </IconButton>
  );
};
