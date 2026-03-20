import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

import "./ScrollButton.scss";

export const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const listenToScroll = () => {
    const heightToHideFrom = 600;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      if (!isVisible) {
        setIsVisible(true); // to limit setting state only the first time
      }
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return isVisible ? (
    <div className="scroll-btn">
      <div className="scroll-btn__tooltip">To Top</div>

      <Button
        className="scroll-btn__btn"
        key="to-top-button"
        aria-label="To Top"
        variant="contained"
        color="secondary"
        onClick={scrollToTop}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </Button>
    </div>
  ) : (
    <></>
  );
};
