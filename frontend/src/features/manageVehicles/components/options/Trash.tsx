import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

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
      <FontAwesomeIcon icon={faTrashCan} />
    </IconButton>
  );
};
