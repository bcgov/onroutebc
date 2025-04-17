import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useOutageNotificationQuery } from "../hooks/outageNotification";
import "./Outagebanner.scss";

const OutageBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const { data, isSuccess } = useOutageNotificationQuery();

  const handleClose = () => {
    setDismissed(true);
  };

  if (!isSuccess || !data || !data.title || !data.message || dismissed)
    return null;

  return (
    <div className="outage-banner">
      <div className="outage-message">
        <strong>{data.title}:</strong>
        <br />
        <span>{data.message}</span>
      </div>
      <button onClick={handleClose} className="close-btn">
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
};

export default OutageBanner;
