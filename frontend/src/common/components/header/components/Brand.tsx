import * as routes from "../../../../routes/constants";
import { useContext } from "react";
import "./Brand.scss";
import OnRouteBCContext from "../../../authentication/OnRouteBCContext";

export const Brand = () => {
  const { companyLegalName } = useContext(OnRouteBCContext);
  return (
    <div className="brand">
      <a className="brand__logo" href={routes.HOME}>
        <img
          src="https://developer.gov.bc.ca/static/BCID_H_rgb_rev-20eebe74aef7d92e02732a18b6aa6bbb.svg"
          alt="Go to the onRouteBC Home Page"
        />
      </a>
      <h1 className="brand__title">onRouteBC</h1>
      {companyLegalName ? (
        <p className="brand__company">{companyLegalName}</p>
      ) : null}
    </div>
  );
};
