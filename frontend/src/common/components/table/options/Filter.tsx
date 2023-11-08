import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import "./Filter.scss";

export const Filter = () => {
  return (
    <>
      <Button
        className="filter-btn"
        aria-label="filter"
        id="filter-button"
        variant="contained"
        color="tertiary"
        aria-haspopup="true"
        startIcon={<FontAwesomeIcon icon={faFilter} />}
        disabled={true}
      >
        Filter
      </Button>
    </>
  );
};
