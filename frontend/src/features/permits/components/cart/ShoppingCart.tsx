import { useEffect, useState } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

import "./ShoppingCart.scss";
import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";
import { CartItem, SelectableCartItem } from "../../types/CartItem";
import { RemoveCartButton } from "./RemoveCartButton/RemoveCartButton";
import { PERMIT_TYPES } from "../../types/PermitType";
import { ShoppingCartItem } from "./ShoppingCartItem/ShoppingCartItem";

export const ShoppingCart = ({
  onCartSelectionChange,
}: {
  onCartSelectionChange: (totalFee: number) => void;
}) => {
  // Temporarily hardcoded test
  const myApplicationItems: CartItem[] = [
    {
      permitId: "1",
      companyId: 73,
      permitType: PERMIT_TYPES.TROS,
      applicationNumber: "A2-00408617-873",
      startDate: "2023-09-14",
      expiryDate: "2023-10-25",
      createdDateTime: "2023-09-13 00:00:00",
      updatedDateTime: "2023-09-13 00:00:00",
      applicant: "Connie Corleone Rizzi",
      plate: "6CR-A824",
      feeSummary: "100.00",
    },
    {
      permitId: "2",
      companyId: 73,
      permitType: PERMIT_TYPES.TROS,
      applicationNumber: "A2-72303011-028",
      startDate: "2023-07-22",
      expiryDate: "2023-08-14",
      createdDateTime: "2023-07-21 00:00:00",
      updatedDateTime: "2023-07-21 00:00:00",
      applicant: "Connie Corleone Rizzi",
      plate: "LHR-6572",
      feeSummary: "100.00",
    },
  ];

  //const allApplicationItems: CartItem[] = [];
  const allApplicationItems: CartItem[] = [
    ...myApplicationItems,
    {
      permitId: "3",
      companyId: 73,
      permitType: PERMIT_TYPES.TROS,
      applicationNumber: "A2-30815429-164",
      startDate: "2023-05-02",
      expiryDate: "2023-06-08",
      createdDateTime: "2023-05-01 00:00:00",
      updatedDateTime: "2023-05-01 00:00:00",
      applicant: "Connie Corleone Rizzi",
      plate: "4RL-F009",
      feeSummary: "350.00",
    },
    {
      permitId: "4",
      companyId: 73,
      permitType: PERMIT_TYPES.TROS,
      applicationNumber: "A2-72303011-027",
      startDate: "2023-04-12",
      expiryDate: "2023-05-30",
      createdDateTime: "2023-04-11 00:00:00",
      updatedDateTime: "2023-04-11 00:00:00",
      applicant: "Connie Corleone Rizzi",
      plate: "LHR-6571",
      feeSummary: "225.00",
    },
  ];
  
  const [showAllApplications, setShowAllApplications] = useState<boolean>(true); // only applicable for CA
  const [cartItemSelection, setCartItemSelection] = useState<SelectableCartItem[]>([]);
  const cartItemsTotalCount = cartItemSelection.length;
  const selectedTotalFee = cartItemSelection
    .filter(cartItem => cartItem.selected)
    .map(cartItem => Number(cartItem.feeSummary))
    .reduce((prevTotal, currFee) => prevTotal + currFee, 0);

  useEffect(() => {
    setCartItemSelection(
      showAllApplications ?
        allApplicationItems.map(cartItem => ({
          ...cartItem,
          selected: true, // all selected by default
          isSelectable: true, // add user permission check (ie. CA can't select staff cart items)
        }))
        : myApplicationItems.map(cartItem => ({
          ...cartItem,
          selected: true, // all selected by default
          isSelectable: true, // add user permission check (ie. CA can't select staff cart items)
        })),
    );
  }, [showAllApplications]);

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

    const selectedPermitIds = cartItemSelection.filter(cartItem => cartItem.selected).map(cartItem => cartItem.permitId);
    // call backend endpoint to remove selected cart items

    // update the following logic to first refetch all cart items, then set cart item selection based on what's fetched
    setCartItemSelection(
      cartItemSelection.filter(cartItem => !selectedPermitIds.includes(cartItem.permitId)),
    );
  };

  const handleSelectItem = (id: string) => {
    setCartItemSelection(
      cartItemSelection.map(cartItem => ({
        ...cartItem,
        selected: cartItem.permitId === id && cartItem.isSelectable ?
          true : cartItem.selected,
      })),
    );
  };

  const handleDeselectItem = (id: string) => {
    setCartItemSelection(
      cartItemSelection.map(cartItem => ({
        ...cartItem,
        selected: cartItem.permitId === id && cartItem.isSelectable ?
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
            key={cartItem.permitId}
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
