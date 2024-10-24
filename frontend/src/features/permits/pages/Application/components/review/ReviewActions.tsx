import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import {
  PERMIT_REVIEW_CONTEXTS,
  PermitReviewContext,
} from "../../../../types/PermitReviewContext";
import "./ReviewActions.scss";

export const ReviewActions = ({
  onEdit,
  continueBtnText,
  onContinue,
  hasToCartButton,
  onAddToCart,
  onApprove,
  updateApplicationMutationPending,
  setShowRejectApplicationModal,
  reviewContext,
}: {
  onEdit: () => void;
  continueBtnText?: string;
  onContinue?: () => Promise<void>;
  hasToCartButton: boolean;
  onAddToCart?: () => Promise<void>;
  onApprove?: () => Promise<void>;
  updateApplicationMutationPending?: boolean;
  setShowRejectApplicationModal?: Dispatch<SetStateAction<boolean>>;
  reviewContext: PermitReviewContext;
}) => {
  return (
    <Box className="review-actions">
      {
        // hide edit button until edit application in queue feature is complete
        reviewContext !== PERMIT_REVIEW_CONTEXTS.QUEUE && (
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
        )
      }

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

      {reviewContext === PERMIT_REVIEW_CONTEXTS.QUEUE &&
      setShowRejectApplicationModal ? (
        <Button
          className="review-actions__btn review-actions__btn--reject"
          key="reject-button"
          aria-label="Reject"
          variant="contained"
          color="error"
          data-testid="reject-btn"
          onClick={() => setShowRejectApplicationModal(true)}
          disabled={updateApplicationMutationPending}
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
          disabled={updateApplicationMutationPending}
        >
          Approve
        </Button>
      ) : null}
    </Box>
  );
};
