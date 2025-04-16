// src/common/components/header/components/OutageBanner.tsx

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useOutageNotificationQuery } from "../hooks/outageNotification";
import "./Outagebanner.scss";

const OutageBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dismissed = sessionStorage.getItem("dismissedBanner");
  const cached = sessionStorage.getItem("cachedBanner");
  const { data, isSuccess } = useOutageNotificationQuery();

  useEffect(() => {
    if (dismissed) return;
    if (cached) {
      //const { title, message } = JSON.parse(cached);
      setIsVisible(true);
      return;
    }

    if (isSuccess && data?.title && data?.message) {
      sessionStorage.setItem("cachedBanner", JSON.stringify(data));
      setIsVisible(true);
    }
  }, [isSuccess, data, cached, dismissed]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("dismissedBanner", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="outage-banner">
      <div className="outage-message">
        <strong>{data?.title}:</strong>
        <br />
        <span>{data?.message}</span>
      </div>
      <button onClick={handleClose} className="close-btn">
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
};

export default OutageBanner;
