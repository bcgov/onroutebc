import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export const Filter = () => {
  return (
    <>
      <Button
        aria-label="filter"
        id="filter-button"
        variant="contained"
        color="tertiary"
        aria-haspopup="true"
        startIcon={<FontAwesomeIcon icon={faFilter} />}
        sx={{ padding: "0px 16px", margin: "0px 20px" }}
        disabled={true}
      >
        Filter
      </Button>
    </>
  );
};
