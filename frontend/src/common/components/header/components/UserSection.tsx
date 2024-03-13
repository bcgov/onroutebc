import "./UserSection.scss";
import { LogoutButton } from "./LogoutButton";
import { UserSectionInfo } from "./UserSectionInfo";
import { ShoppingCartButton } from "./ShoppingCartButton";
import { useFeatureFlagsQuery } from "../../../hooks/hooks";

export const UserSection = ({ username }: { username: string }) => {
  const { data: featureFlags } = useFeatureFlagsQuery();

  return (
    <div className="user-section">
      <UserSectionInfo username={username} />
      {featureFlags?.["SHOPPING_CART"] === "ENABLED" && <ShoppingCartButton cartItemCount={4} />}
      <LogoutButton />
    </div>
  );
};
