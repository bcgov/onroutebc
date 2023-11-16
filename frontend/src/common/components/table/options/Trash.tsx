import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import "./Trash.scss";

export const Trash = ({
  onClickTrash,
  disabled,
}: {
  onClickTrash: () => void;
  disabled?: boolean;
}) => {
  const additionalClasses = disabled
    ? "trash-btn--disabled"
    : "trash-btn--active";

  return (
    <IconButton
      className={`trash-btn ${additionalClasses}`}
      type="button"
      aria-label="delete"
      disabled={disabled}
      onClick={() => {
        onClickTrash();
      }}
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </IconButton>
  );
};
