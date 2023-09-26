import { Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

import "./ReviewActions.scss";

export const ReviewActions = ({
  onEdit,
  onContinue,
  continueBtnText,
}: {
  onEdit: () => void;
  onContinue: () => Promise<void>;
  continueBtnText: string;
}) => {
  return (
    <Box className="review-actions">
      <Button
        className="review-actions__btn review-actions__btn--edit"
        key="edit-TROS-button"
        aria-label="edit"
        variant="contained"
        color="tertiary"
        onClick={onEdit}
      >
        <FontAwesomeIcon icon={faPencil} />
        Edit
      </Button>
      <Button
        className="review-actions__btn review-actions__btn--continue"
        key="submit-TROS-button"
        aria-label="Submit"
        variant="contained"
        color="primary"
        onClick={onContinue}
        data-testid="continue-btn"
      >
        {continueBtnText}
      </Button>
    </Box>
  );
};
