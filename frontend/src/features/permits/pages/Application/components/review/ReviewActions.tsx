/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import "./ReviewActions.scss";

export const ReviewActions = ({
  onEdit,
  continueBtnText,
  onContinue,
  hasToCartButton,
  onAddToCart,
  onApprove,
  onReject,
  rejectApplicationMutationPending,
}: {
  onEdit: () => void;
  continueBtnText?: string;
  onContinue?: () => Promise<void>;
  hasToCartButton: boolean;
  onAddToCart?: () => Promise<void>;
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  rejectApplicationMutationPending?: boolean;
}) => {
  return (
    <Box className="review-actions">
      <Button
        className="review-actions__btn review-actions__btn--edit"
        key="edit-application-button"
        aria-label="Edit"
        variant="contained"
        color="tertiary"
        onClick={onEdit}
      >
        <FontAwesomeIcon
          className="button-icon button-icon--edit"
          icon={faPencil}
        />
        Edit
      </Button>

      {hasToCartButton ? (
        <Button
          className="review-actions__btn review-actions__btn--cart"
          key="add-to-cart-button"
          aria-label="Add To Cart"
          variant="outlined"
          color="tertiary"
          data-testid="add-to-cart-btn"
          onClick={onAddToCart}
        >
          Add to Cart
        </Button>
      ) : null}

      {continueBtnText ? (
        <Button
          className="review-actions__btn review-actions__btn--continue"
          key="submit-application-button"
          aria-label="Submit"
          variant="contained"
          color="primary"
          onClick={onContinue}
          data-testid="continue-btn"
        >
          {continueBtnText}
        </Button>
      ) : null}

      {onReject ? (
        <Button
          className="review-actions__btn review-actions__btn--reject"
          key="reject-button"
          aria-label="Reject"
          variant="contained"
          color="error"
          data-testid="reject-btn"
          onClick={onReject}
          disabled={rejectApplicationMutationPending}
        >
          Reject
        </Button>
      ) : null}

      {onApprove ? (
        <Button
          className="review-actions__btn review-actions__btn--approve"
          key="approve-button"
          aria-label="Approve"
          variant="contained"
          color="primary"
          data-testid="approve-btn"
          onClick={onApprove}
        >
          Approve
        </Button>
      ) : null}
    </Box>
  );
};
