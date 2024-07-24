import { useContext } from "react";

import { CartContext } from "../../../../features/permits/context/CartContext";
import OnRouteBCContext from "../../../authentication/OnRouteBCContext";
import { getDefaultRequiredVal } from "../../../helpers/util";
import { RenderIf } from "../../reusable/RenderIf";
import { LogoutButton } from "./LogoutButton";
import { ShoppingCartButton } from "./ShoppingCartButton";
import "./UserSection.scss";
import { UserSectionInfo } from "./UserSectionInfo";

export const UserSection = ({ username }: { username: string }) => {
  const { companyId } = useContext(OnRouteBCContext);
  const { cartCount } = useContext(CartContext);
  const cartItemCount = getDefaultRequiredVal(0, cartCount);
  const showShoppingCart = Boolean(companyId);

  return (
    <div className="user-section">
      <UserSectionInfo username={username} />
      <RenderIf
        component={<ShoppingCartButton cartItemCount={cartItemCount} />}
        permissionMatrixFeatureKey="MISCELLANEOUS"
        permissionMatrixFunctionKey="VIEW_SHOPPING_CART"
        additionalConditionToCheck={() => showShoppingCart}
      />
      <LogoutButton />
    </div>
  );
};
