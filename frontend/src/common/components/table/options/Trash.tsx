import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import "./Trash.scss";

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
      className="trash-btn"
      type="button"
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
