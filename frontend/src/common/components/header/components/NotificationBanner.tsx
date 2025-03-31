import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./NotificationBanner.scss";

const NotificationBanner = ({
  message,
  title,
}: {
  title: string;
  message: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message && !sessionStorage.getItem("dismissedBanner")) {
      setIsVisible(true);
    }
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("dismissedBanner", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="notification-banner">
      <div className="notification-message">
        <strong>{title}:</strong>
        <span>{message}</span>
      </div>
      <button onClick={handleClose} className="close-btn">
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
};

export default NotificationBanner;
