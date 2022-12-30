import { Button } from "@mui/material";

export const Filter = () => {

  return (
    <>
      <Button
        aria-label="filter"
        id="filter-button"
        variant="contained"
        color="secondary"
        aria-haspopup="true"
        startIcon={<i className="fa fa-filter"></i>}
        sx={{ margin: "0px 20px" }}
      >
        Filter
      </Button>
    </>
  );
};
