import { IconButton } from "@mui/material";

export const Trash = ({
  onClickTrash,
}: {
  /**
   * A callback function on clicking the trash icon.
   * @returns void
   */
  onClickTrash: () => void;
}) => {
  return (
    <IconButton
      type="button"
      sx={{ p: "10px 10px" }}
      aria-label="delete"
      disabled={false}
      onClick={() => {
        onClickTrash();
      }}
    >
      <i className="fa fa-trash"></i>
    </IconButton>
  );
};
