import "./CartChangedWarningBanner.scss";
import { WarningBcGovBanner } from "../../../../../common/components/banners/WarningBcGovBanner";

export const CartChangedWarningBanner = ({
  removedItems,
}: {
  removedItems: string[];
}) => {
  return (
    <WarningBcGovBanner
      className="cart-changed-warning-banner"
      msg="Your shopping cart has changed."
      additionalInfo={
        <div className="cart-changed-warning-banner__info">
          <div className="warning-description">
            Application(s) with errors or updates have been removed from your cart.
          </div>

          <ul className="removed-items">
            {removedItems.map(removedItem => (
              <li key={removedItem} className="removed-items__item">
                {removedItem}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
};
