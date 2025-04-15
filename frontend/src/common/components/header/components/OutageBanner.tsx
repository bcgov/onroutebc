import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./Outagebanner.scss";
import { PUBLIC_API_URL } from "../../../apiManager/endpoints/endpoints";

const NotificationBanner = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState<React.ReactNode>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("dismissedBanner");
    const cached = sessionStorage.getItem("cachedBanner");

    if (dismissed) return;

    if (cached) {
      const { title, message } = JSON.parse(cached);
      setTitle(title);
      setMessage(message);
      setIsVisible(true);
      return;
    }

    axios
      .get(`${PUBLIC_API_URL}/outage-notification`)
      .then((res) => {
        if (res.status === 200 && res.data?.title && res.data?.message) {
          setTitle(res.data.title);
          setMessage(res.data.message);
          setIsVisible(true);
          sessionStorage.setItem(
            "cachedBanner",
            JSON.stringify({
              title: res.data.title,
              message: res.data.message,
            }),
          );
        }
      })
      .catch((err) => {
        if (err.response?.status === 429) {
          console.warn("Too many requests. Try again later.");
        } else {
          console.error("Error fetching outage notification:", err);
        }
      });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("dismissedBanner", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="outage-banner">
      <div className="outage-message">
        <strong>{title}:</strong>
        <br />
        <span>{message}</span>
      </div>
      <button onClick={handleClose} className="close-btn">
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
};

export default NotificationBanner;
