import { BasePermitList } from "./BasePermitList";
import "./ExpiredPermitList.scss";

/**
 * A wrapper with the query to load the table with expired permits.
 */
export const ExpiredPermitList = () => {
  return (
    <div className="table-container">
      <BasePermitList isExpired />
    </div>
  );
};

ExpiredPermitList.displayName = "ExpiredPermitList";
