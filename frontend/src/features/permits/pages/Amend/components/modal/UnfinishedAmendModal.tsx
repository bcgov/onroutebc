import { Button, Dialog } from "@mui/material";

import "./UnfinishedAmendModal.scss";

export const UnfinishedAmendModal = ({
  shouldOpen,
  issuedPermitNumber,
  unfinishedAmendmentCreatedBy,
  onCancel,
  onStartNewAmendment,
  onContinueAmendment,
}: {
  shouldOpen: boolean;
  issuedPermitNumber: string;
  unfinishedAmendmentCreatedBy: string;
  onCancel: () => void;
  onStartNewAmendment: () => void;
  onContinueAmendment: () => void;
}) => {
  return (
    <Dialog
      className="unfinished-amend-modal"
      onClose={onCancel}
      aria-labelledby="unfinished-amend-modal-title"
      aria-describedby="unfinished-amend-modal-desc"
      open={shouldOpen}
      classes={{
        paper: "unfinished-amend-modal__paper"
      }}
    >
      <div className="unfinished-amend-modal__header">
        <h3
          id="unfinished-amend-modal-title"
          className="unfinished-amend-modal__title"
        >
          Amend Permit
        </h3>
      </div>

      <div className="unfinished-amend-modal__body">
        <h4
          id="unfinished-amend-modal-desc"
          className="unfinished-amend-modal__permit-number"
        >
          Amending Permit # {issuedPermitNumber}
        </h4>

        <p className="unfinished-amend-modal__info">
          <span className="staff-name">
            {unfinishedAmendmentCreatedBy}
          </span>
          has started an amendment for this permit. Would you like to continue editing it or restart with a new amendment?
        </p>
      </div>

      <div className="unfinished-amend-modal__actions">
        <Button
          className="unfinished-amend-modal__btn unfinished-amend-modal__btn--cancel"
          variant="contained"
          color="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          className="unfinished-amend-modal__btn unfinished-amend-modal__btn--new"
          key="start-new-amendment-button"
          aria-label="New Amendment"
          variant="outlined"
          color="tertiary"
          data-testid="start-new-amendment-btn"
          onClick={onStartNewAmendment}
        >
          New Amendment
        </Button>
        
        <Button
          className="unfinished-amend-modal__btn unfinished-amend-modal__btn--continue"
          key="continue-amendment-button"
          aria-label="Continue Amendment"
          variant="contained"
          color="primary"
          onClick={onContinueAmendment}
          data-testid="continue-amendment-btn"
        >
          Continue Amendment
        </Button>
      </div>
    </Dialog>
  );
};
