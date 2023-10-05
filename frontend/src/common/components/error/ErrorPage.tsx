import { Divider } from "@mui/material";

import "./ErrorPage.scss";

export const ErrorPage = ({
  errorTitle,
  msgNode,
}: {
  errorTitle: string;
  msgNode: React.ReactNode;
}) => {
  return (
    <div className="error-page">
      <div className="error-page__wrapper">
        <img
          className="error-page__img"
          height="168"
          width="178"
          src="/Error_Screen_Graphic.svg"
          alt="Error Screen Graphic"
        />
        <div className="error-page__title">
          {errorTitle}
        </div>
        <div className="error-page__msg">
          <Divider />
          <p className="msg">
            {msgNode}
          </p>
          <Divider />
        </div>
      </div>
    </div>
  );
};
