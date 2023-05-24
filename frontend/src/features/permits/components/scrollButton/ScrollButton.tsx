import { Button, useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

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
      !isVisible && // to limit setting state only the first time
        setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("lg"));

  return isVisible ? (
    <Button
      key="to-top-button"
      aria-label="To Top"
      variant="contained"
      color="secondary"
      onClick={scrollToTop}
      sx={{
        position: "fixed",
        bottom: 120,
        right: matches ? 20 : 60,
        width: "20px",
      }}
    >
      <FontAwesomeIcon
        icon={faChevronUp}
        style={{ marginLeft: "8px", marginRight: "8px" }}
      />
    </Button>
  ) : (
    <></>
  );
};
