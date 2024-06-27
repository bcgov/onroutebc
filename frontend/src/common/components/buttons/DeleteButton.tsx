import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import "./DeleteButton.scss";

export const DeleteButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  const additionalClasses = disabled
    ? "delete-btn--disabled"
    : "delete-btn--active";

  return (
    <button
      className={`delete-btn ${additionalClasses}`}
      type="button"
      aria-label="delete"
      disabled={disabled}
      onClick={onClick}
    >
      <FontAwesomeIcon className="delete-btn__icon" icon={faTrashCan} />
      <span className="delete-btn__text">Delete</span>
    </button>
  );
};
