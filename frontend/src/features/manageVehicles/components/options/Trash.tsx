import { IconButton } from "@mui/material";

export const Trash = () => {
  return (
      <IconButton type="button" sx={{ p: "10px 10px" }} aria-label="delete">
        <i className="fa fa-trash"></i>
      </IconButton>
  );
};
