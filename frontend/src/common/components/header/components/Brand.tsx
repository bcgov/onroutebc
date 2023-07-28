import * as routes from "../../../../routes/constants";
import { useContext } from "react";
import "./Brand.scss";
import OnRouteBCContext from "../../../authentication/OnRouteBCContext";

export const Brand = () => {
  const { companyLegalName } = useContext(OnRouteBCContext);
  return (
    <div className="brand">
      <a href={routes.HOME}>
        <img
          src="https://developer.gov.bc.ca/static/BCID_H_rgb_rev-20eebe74aef7d92e02732a18b6aa6bbb.svg"
          alt="Go to the onRouteBC Home Page"
          height="50px"
        />
      </a>
      <h1>onRouteBC <strong>{`| ${companyLegalName}`}</strong></h1>
    </div>
  );
};
