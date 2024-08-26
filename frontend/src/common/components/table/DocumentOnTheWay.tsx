import { memo } from "react";

import "./DocumentOnTheWay.scss";

export const DocumentOnTheWay = memo(() => {
  return (
    <div className="document-on-the-way">
      <div className="document-on-the-way__section document-on-the-way__section--img">
        <img
          src="/Error_Screen_Graphic.svg"
          className="document-on-the-way__img"
          alt="No Data Graphic"
        />
      </div>
      <div className="document-on-the-way__section document-on-the-way__section--msg">
        <h2 className="document-on-the-way__msg">Your document is on the way</h2>
      </div>
      <hr className="custom-hr"/>
      <div className="document-on-the-way-des__msg">
        Your document is being created.
        <br />
        Please check again later.
      </div>
      <hr className="custom-hr"/>
    </div>
    
  );
});

DocumentOnTheWay.displayName = "DocumentOnTheWay";