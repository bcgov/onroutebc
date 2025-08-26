import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { CheckBox, IndeterminateCheckBox } from "@mui/icons-material";
import "./ShoppingCart.scss";
import { RemoveCartButton } from "./RemoveCartButton";
import { ShoppingCartItem } from "./ShoppingCartItem";
import { SelectableCartItem } from "../../../types/CartItem";

export const ShoppingCart = ({
  showCartFilter,
  showAllApplications,
  cartItemSelection,
  toggleSelectAll,
  handleCartFilterChange,
  handleSelectItem,
  handleDeselectItem,
  handleRemoveSelected,
  handleEditCartItem,
}: {
  showCartFilter: boolean;
  showAllApplications: boolean;
  cartItemSelection: SelectableCartItem[];
  toggleSelectAll: () => void;
  handleCartFilterChange: (filter: string) => void;
  handleSelectItem: (id: string) => void;
  handleDeselectItem: (id: string) => void;
  handleRemoveSelected: () => Promise<void>;
  handleEditCartItem: (id: string) => void;
}) => {
  const cartItemsTotalCount = cartItemSelection.length;
  const selectedItemsCount = cartItemSelection.filter(
    (cartItem) => cartItem.selected,
  ).length;

  const someItemsSelected = selectedItemsCount > 0;
  const allItemsSelected =
    cartItemsTotalCount > 0 && selectedItemsCount === cartItemsTotalCount;

  return (
    <div className="shopping-cart">
      <div className="shopping-cart__heading">Shopping Cart</div>

      <div className="shopping-cart__actions actions">
        <div className="actions__select select">
          <Checkbox
            className="select__checkbox"
            aria-labelledby="shopping-cart-select-label"
            disabled={cartItemsTotalCount === 0}
            checked={someItemsSelected}
            checkedIcon={
              allItemsSelected ? <CheckBox /> : <IndeterminateCheckBox />
            }
            onChange={toggleSelectAll}
          />
          <FormLabel id="shopping-cart-select-label" className="select__label">
            {`${selectedItemsCount} of ${cartItemsTotalCount} Selected`}
          </FormLabel>
        </div>
        {showCartFilter && (
          <div className="actions__filter filter">
            <FormLabel id="shopping-cart-filter-label">View: </FormLabel>
            <RadioGroup
              className="filter__options"
              aria-labelledby="shopping-cart-filter-label"
              defaultValue={showAllApplications}
              value={showAllApplications}
              onChange={(e) => handleCartFilterChange(e.target.value)}
            >
              <FormControlLabel
                className="filter__label"
                label="All applications"
                value={true}
                control={
                  <Radio
                    key="all-applications"
                    className="filter__radio"
                    classes={{
                      checked: "filter__radio--checked",
                    }}
                  />
                }
              />

              <FormControlLabel
                className="filter__label"
                label="My applications"
                value={false}
                control={
                  <Radio
                    key="my-applications"
                    className="filter__radio"
                    classes={{
                      checked: "filter__radio--checked",
                    }}
                  />
                }
              />
            </RadioGroup>
          </div>
        )}
        <div className="actions__remove">
          <RemoveCartButton
            onRemove={handleRemoveSelected}
            isDisabled={selectedItemsCount === 0}
          />
        </div>
      </div>

      <div className="shopping-cart__items">
        {cartItemsTotalCount > 0 ? (
          cartItemSelection.map((cartItem) => (
            <ShoppingCartItem
              onEditCartItem={handleEditCartItem}
              key={cartItem.applicationId}
              cartItemData={cartItem}
              isSelected={cartItem.selected}
              isDisabled={!cartItem.isSelectable}
              onSelect={handleSelectItem}
              onDeselect={handleDeselectItem}
            />
          ))
        ) : (
          <div className="shopping-cart__empty">Cart is empty.</div>
        )}
      </div>
    </div>
  );
};
