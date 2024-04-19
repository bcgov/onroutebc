import { useContext, useEffect, useState } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

import "./ShoppingCart.scss";
import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";
import { SelectableCartItem } from "../../types/CartItem";
import { RemoveCartButton } from "./RemoveCartButton/RemoveCartButton";
import { ShoppingCartItem } from "./ShoppingCartItem/ShoppingCartItem";
import { useFetchCart, useRemoveFromCart } from "../../hooks/cart";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { hasPermitsActionFailed } from "../../helpers/permitState";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { BCeID_USER_AUTH_GROUP } from "../../../../common/authentication/types";

export const ShoppingCart = ({
  onCartSelectionChange,
  companyId,
}: {
  onCartSelectionChange: (totalFee: number) => void;
  companyId: string;
}) => {
  const { userDetails } = useContext(OnRouteBCContext);
  const isCompanyAdmin = Boolean(userDetails?.userAuthGroup === BCeID_USER_AUTH_GROUP.COMPANY_ADMINISTRATOR);
  const [showAllApplications, setShowAllApplications] = useState<boolean>(isCompanyAdmin);
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
    const items = getDefaultRequiredVal([], cartItems);
    setCartItemSelection(
      items.map(cartItem => ({
        ...cartItem,
        selected: true, // all selected by default
        isSelectable: true, // add user permission check (ie. CA can't select staff cart items)
      })),
    );
  }, [cartItems]);

  useEffect(() => {
    onCartSelectionChange(selectedTotalFee);
  }, [selectedTotalFee]);

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

  const handleRemoveSelected = async () => {
    if (selectedItemsCount === 0) return;

    const selectedApplicationIds = cartItemSelection
      .filter(cartItem => cartItem.selected)
      .map(cartItem => cartItem.applicationId);

    const removeResult = await removeFromCartMutation.mutateAsync({
      companyId,
      applicationIds: selectedApplicationIds,
    });

    if (hasPermitsActionFailed(removeResult)) {
      // Display warning banner showing failed ids
    } else {
      // Hide warning banner
    }

    cartQuery.refetch();
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
  
  return (
    <div className="shopping-cart">
      <div className="shopping-cart__header">
        <div className="shopping-cart__header-section shopping-cart__header-section--main">
          <div className="shopping-cart__main-header">
            <div className="shopping-cart__title">Shopping Cart</div>

            <div className="shopping-cart__info">
              <div className="select-info select-info--selected-count">
                {`${selectedItemsCount} of ${cartItemsTotalCount} Selected`}
              </div>

              <CustomActionLink
                className={`select-info select-info--select-all`}
                disabled={cartItemsTotalCount === 0}
                onClick={toggleSelectAll}
              >
                {selectedItemsCount !== cartItemsTotalCount ? "Select All" : "Deselect All"}
              </CustomActionLink>
            </div>
          </div>

          {isCompanyAdmin ? (
            <RadioGroup
              className="shopping-cart__filter"
              defaultValue={showAllApplications}
              value={showAllApplications}
              onChange={(e) => handleCartFilterChange(e.target.value)}
            >
              <div
                className={`cart-filter ${
                  showAllApplications
                    ? "cart-filter--active"
                    : ""
                }`}
              >
                <FormControlLabel
                  className="cart-filter__label"
                  label="All applications"
                  value={true}
                  control={
                    <Radio
                      key="all-applications"
                      className="cart-filter__radio"
                      classes={{
                        checked: "cart-filter__radio--checked"
                      }}
                    />}
                />
              </div>

              <div
                className={`cart-filter ${
                  !showAllApplications
                    ? "cart-filter--active"
                    : ""
                }`}
              >
                <FormControlLabel
                  className="cart-filter__label"
                  label="My applications"
                  value={false}
                  control={
                    <Radio
                      key="my-applications"
                      className="cart-filter__radio"
                      classes={{
                        checked: "cart-filter__radio--checked"
                      }}
                    />
                  }
                />
              </div>
            </RadioGroup>
          ) : null}
        </div>

        <div className="shopping-cart__header-section shopping-cart__header-section--actions">
          <RemoveCartButton
            onRemove={handleRemoveSelected}
            isDisabled={selectedItemsCount === 0}
          />
        </div>
      </div>

      <div className="shopping-cart__items">
        {cartItemsTotalCount > 0 ? cartItemSelection.map(cartItem => (
          <ShoppingCartItem
            key={cartItem.applicationId}
            cartItemData={cartItem}
            isSelected={cartItem.selected}
            isDisabled={!cartItem.isSelectable}
            onSelect={handleSelectItem}
            onDeselect={handleDeselectItem}
          />
        )) : (
          <div className="shopping-cart__empty">
            Nothing found.
          </div>
        )}
      </div>
    </div>
  );
};
