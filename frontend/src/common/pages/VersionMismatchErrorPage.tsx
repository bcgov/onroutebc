import { ErrorPage } from "../components/error/ErrorPage";
import "./UniversalUnexpected.scss";
import "./VersionMismatchErrorPage.scss";
import { Link } from "react-router-dom";
import { HOME } from "../../routes/constants";

export const VersionMismatchErrorPage = () => {
  return (
    <ErrorPage
      errorTitle="onRouteBC has been updated"
      imgSrc="/New_Update_Graphic.png"
      msgNode={
        <div className="unexpected-error-msg">
          <span className="unexpected-error-msg__text">
            Click{" "}
            <Link
              className="version-mismatch__link"
              onClick={() => {
                // Directly changing the href refreshes the page 
                // and takes user to home.
                window.location.href = HOME;
              }}
              to={"#"}
            >
              here
            </Link>{" "}
            to continue.
          </span>
          <br></br>
        </div>
      }
    />
  );
};
