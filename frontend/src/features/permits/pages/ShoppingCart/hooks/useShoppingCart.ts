import { useContext, useEffect, useState } from "react";

import { CartContext } from "../../../context/CartContext";
import { useFetchCart, useRemoveFromCart } from "../../../hooks/cart";
import { SelectableCartItem } from "../../../types/CartItem";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";

export const useShoppingCart = (
  companyId: string,
  enableCartFilter: boolean,
) => {
  const { refetchCartCount } = useContext(CartContext);
  const [showAllApplications, setShowAllApplications] = useState<boolean>(enableCartFilter);
  const removeFromCartMutation = useRemoveFromCart();
  const cartQuery = useFetchCart(companyId, showAllApplications);
  const { data: cartItems } = cartQuery;
  const [cartItemSelection, setCartItemSelection] = useState<SelectableCartItem[]>([]);
  const cartItemsTotalCount = cartItemSelection.length;
  const selectedTotalFee = cartItemSelection
    .filter(cartItem => cartItem.selected)
    .map(cartItem => cartItem.fee)
    .reduce((prevTotal, currFee) => prevTotal + currFee, 0);

  useEffect(() => {
    // Always refetch cart count upon rendering shopping cart
    refetchCartCount();
  }, []);

  useEffect(() => {
    const items = getDefaultRequiredVal([], cartItems);
    setCartItemSelection(
      items.map(cartItem => ({
        ...cartItem,
        selected: true, // all selected by default
        isSelectable: true, // add user permission check (ie. CA can't select staff cart items)
      })),
    );
  }, [cartItems]);

  const selectedItemsCount = cartItemSelection.filter(cartItem => cartItem.selected).length;

  const toggleSelectAll = () => {
    if (cartItemsTotalCount === 0) return;

    if (selectedItemsCount !== cartItemsTotalCount) {
      setCartItemSelection(cartItemSelection.map(cartItem => ({
        ...cartItem,
        selected: cartItem.isSelectable ? true : cartItem.selected,
      })));
    } else {
      setCartItemSelection(cartItemSelection.map(cartItem => ({
        ...cartItem,
        selected: cartItem.isSelectable ? false : cartItem.selected,
      })));
    }
  };

  const handleCartFilterChange = (filter: string) => {
    setShowAllApplications(filter === "true");
  };

  const handleSelectItem = (id: string) => {
    setCartItemSelection(
      cartItemSelection.map(cartItem => ({
        ...cartItem,
        selected: cartItem.applicationId === id && cartItem.isSelectable ?
          true : cartItem.selected,
      })),
    );
  };

  const handleDeselectItem = (id: string) => {
    setCartItemSelection(
      cartItemSelection.map(cartItem => ({
        ...cartItem,
        selected: cartItem.applicationId === id && cartItem.isSelectable ?
          false : cartItem.selected,
      })),
    );
  };

  return {
    removeFromCartMutation,
    cartQuery,
    cartItems,
    cartItemSelection,
    selectedTotalFee,
    showAllApplications,
    toggleSelectAll,
    handleCartFilterChange,
    handleSelectItem,
    handleDeselectItem,
    refetchCartCount,
  };
};
