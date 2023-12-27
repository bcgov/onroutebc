import { memo } from "react";

import "./NoRecordsFound.scss";

export const NoRecordsFound = memo(() => {
  return (
    <div className="no-records-found">
      <div className="no-records-found__section no-records-found__section--img">
        <img
          src="No_Data_Graphic.svg"
          className="no-records-found__img"
          alt="No Data Graphic"
        />
      </div>
      <div className="no-records-found__section no-records-found__section--msg">
        <h3 className="no-records-found__msg">No Records Found.</h3>
      </div>
    </div>
  );
});

NoRecordsFound.displayName = "NoRecordsFound";
