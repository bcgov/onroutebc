import { useContext } from "react";

import "./SuspendSnackBar.scss";
import { ErrorBcGovBanner } from "../banners/ErrorBcGovBanner";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";

export const SuspendSnackBar = () => {
  const { isCompanySuspended } = useContext(OnRouteBCContext);

  return isCompanySuspended ? (
    <ErrorBcGovBanner
      msg="Company suspended"
      className="suspend-snackbar"
    />
  ) : null;
};
