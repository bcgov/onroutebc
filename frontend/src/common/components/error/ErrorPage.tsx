import "./ErrorPage.scss";

export const ErrorPage = ({
  errorTitle,
  msgNode,
  imgSrc = "/Error_Screen_Graphic.svg",
}: {
  errorTitle: string;
  msgNode: React.ReactNode;
  imgSrc?: string; 
}) => {
  return (
    <div className="error-page">
      <div className="error-page__wrapper">
        <img
          className="error-page__img"
          src={imgSrc}
          alt="Error Screen Graphic"
        />

        <div className="error-page__title">
          {errorTitle}
        </div>

        <div className="error-page__msg">
          {msgNode}
        </div>
      </div>
    </div>
  );
};
