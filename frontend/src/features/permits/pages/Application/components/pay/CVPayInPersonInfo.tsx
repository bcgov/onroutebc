import "./CVPayInPersonInfo.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

export const CVPayInPersonInfo = () => {
  return (
    <div className="cv-pay-in-person-info">
      <h3 className="cv-pay-in-person-info__heading">
        Pay In-person (Cash/Cheque/Debit)
      </h3>
      <p className="cv-pay-in-person-info__body">
        Pay in person at the <strong>Provincial Permit Centre</strong> <br></br>
        Toll-free: <strong>1-800-559-9688</strong> or Email:{" "}
        <strong>ppcpermit@gov.bc.ca</strong>
        <br />
        <br />
        Pay in person at a <strong>Service BC Office (GA)</strong>
      </p>
      <a
        href="https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/citizens-services/servicebc#locations"
        className="cv-pay-in-person-info__link"
        target="_blank"
        rel="noreferrer"
      >
        Service BC Office (GA) Locations{" "}
      </a>
      <FontAwesomeIcon
        className="cv-pay-in-person-info__icon"
        icon={faExternalLink}
      />
    </div>
  );
};
