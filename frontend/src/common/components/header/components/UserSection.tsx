import { useContext } from "react";

import "./UserSection.scss";
import { LogoutButton } from "./LogoutButton";
import { UserSectionInfo } from "./UserSectionInfo";
import { ShoppingCartButton } from "./ShoppingCartButton";
import { getDefaultRequiredVal } from "../../../helpers/util";
import { CartContext } from "../../../../features/permits/context/CartContext";
import OnRouteBCContext from "../../../authentication/OnRouteBCContext";
import { RenderIf } from "../../reusable/RenderIf";
import { IDIR_USER_AUTH_GROUP } from "../../../authentication/types";

export const UserSection = ({ username }: { username: string }) => {
  const { companyId } = useContext(OnRouteBCContext);
  const { cartCount } = useContext(CartContext);
  const cartItemCount = getDefaultRequiredVal(0, cartCount);
  const showShoppingCart = Boolean(companyId);

  return (
    <div className="user-section">
      <UserSectionInfo username={username} />

      {showShoppingCart ? (
        <RenderIf
          component={<ShoppingCartButton cartItemCount={cartItemCount} />}
          disallowedAuthGroups={[IDIR_USER_AUTH_GROUP.FINANCE]}
        />
      ) : null}

      <LogoutButton />
    </div>
  );
};
