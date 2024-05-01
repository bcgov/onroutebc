import { useContext, useEffect, useState } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./ShoppingCart.scss";
import { CustomActionLink } from "../../../../../common/components/links/CustomActionLink";
import { CartItem, SelectableCartItem } from "../../../types/CartItem";
import { RemoveCartButton } from "./RemoveCartButton";
import { ShoppingCartItem } from "./ShoppingCartItem";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { hasPermitsActionFailed } from "../../../helpers/permitState";
import OnRouteBCContext from "../../../../../common/authentication/OnRouteBCContext";
import { BCeID_USER_AUTH_GROUP } from "../../../../../common/authentication/types";
import { CartContext } from "../../../context/CartContext";
import { CartChangedWarningBanner } from "./CartChangedWarningBanner";
import { PERMIT_STATUSES } from "../../../types/PermitStatus";
import { EditCartItemDialog } from "../../../components/cart/EditCartItemDialog";
import { UpdateCartDialog } from "../../../components/cart/UpdateCartDialog";
import { APPLICATIONS_ROUTES } from "../../../../../routes/constants";
import { getOutdatedCartItems } from "../../../helpers/cart";
import {
  useFetchCart,
  useRemoveFromCart,
  useFetchCartItemStatus,
} from "../../../hooks/cart";

export const ShoppingCart = ({
  onCartSelectionChange,
  companyId,
}: {
  onCartSelectionChange: (totalFee: number) => void;
  companyId: string;
}) => {
  const navigate = useNavigate();
  const { userDetails } = useContext(OnRouteBCContext);
  const { refetchCartCount } = useContext(CartContext);
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
  
  const [showEditCartItemDialog, setShowEditCartItemDialog] = useState<boolean>(false);
  const {
    cartItemId: idOfCartItemToEdit,
    cartItemData: cartItemToEdit,
    fetchStatusFor,
  } = useFetchCartItemStatus();

  const [oldCartItems, setOldCartItems] = useState<CartItem[]>([]);

  const [showUpdateCartDialog, setShowUpdateCartDialog] = useState<boolean>(false);

  useEffect(() => {
    // Reset old cart items whenever radio button filter is changed
    setOldCartItems([]); 
  }, [showAllApplications]);

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

  useEffect(() => {
    if (cartItemToEdit) {
      if (cartItemToEdit.permitStatus === PERMIT_STATUSES.IN_CART) {
        setShowEditCartItemDialog(true);
      } else {
        setShowUpdateCartDialog(true);
      }
    }
  }, [cartItemToEdit]);

  const outdatedApplicationNumbers = getOutdatedCartItems(
    oldCartItems,
    getDefaultRequiredVal([], cartItems),
  ).map(cartItem => cartItem.applicationNumber);

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
      // Removal failed, show update cart dialog
      setShowUpdateCartDialog(true);
    } else {
      // Reset old items since remove succeeded (no need to compare and display warning)
      setOldCartItems([]);
      cartQuery.refetch();
      refetchCartCount();
    }
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

  const handleEditCartItem = (id: string) => {
    fetchStatusFor(id);
  };

  const handleConfirmEdit = async () => {
    if (idOfCartItemToEdit) {
      const removeResult = await removeFromCartMutation.mutateAsync({
        companyId,
        applicationIds: [idOfCartItemToEdit],
      });

      if (hasPermitsActionFailed(removeResult)) {
        // Record current items (before refetch) as old items for comparison
        setOldCartItems([...cartItemSelection]);
        cartQuery.refetch();
        refetchCartCount();
      } else {
        // Close the edit dialog and navigate to edit application
        setOldCartItems([]);
        setShowEditCartItemDialog(false);
        refetchCartCount();
        navigate(APPLICATIONS_ROUTES.DETAILS(idOfCartItemToEdit));
      }
    }
  };

  const handleForceUpdateCart = () => {
    setOldCartItems([...cartItemSelection]);
    cartQuery.refetch();
    refetchCartCount();
    setShowUpdateCartDialog(false);
  };
  
  return (
    <div className="shopping-cart">
      {outdatedApplicationNumbers.length > 0 ? (
        <CartChangedWarningBanner removedItems={outdatedApplicationNumbers} />
      ) : null}

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
                className={`cart-filter cart-filter--all ${
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
                className={`cart-filter cart-filter--my ${
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
            onEditCartItem={handleEditCartItem}
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

      <EditCartItemDialog
        shouldOpen={showEditCartItemDialog}
        handleCancel={() => setShowEditCartItemDialog(false)}
        handleEdit={handleConfirmEdit}
      />

      <UpdateCartDialog
        shouldOpen={showUpdateCartDialog}
        onUpdateCart={handleForceUpdateCart}
      />
    </div>
  );
};
