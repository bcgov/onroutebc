import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "@mui/material";

import "./FormActions.scss";
import { ScrollButton } from "../../../../components/scrollButton/ScrollButton";

export const FormActions = ({
  onLeave,
  onSave,
  onCancel,
  onContinue,
  enableScroll = true,
}: {
  onLeave?: () => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  onContinue: () => Promise<void>;
  enableScroll?: boolean;
}) => {
  return (
    <Box className="application-form-actions">
      {onLeave ? (
        <Button
          key="leave-application-button"
          className="application-form-actions__btn application-form-actions__btn--leave"
          aria-label="leave"
          variant="contained"
          color="secondary"
          onClick={onLeave}
          data-testid="leave-application-button"
        >
          Leave
        </Button>
      ) : null}

      <Box className="application-form-actions__section application-form-actions__section--main">
        {onSave ? (
          <Button
            key="save-application-button"
            className="application-form-actions__btn application-form-actions__btn--save"
            aria-label="save"
            variant="contained"
            color="tertiary"
            onClick={() => onSave()}
            data-testid="save-application-button"
          >
            <FontAwesomeIcon icon={faSave} />
            Save Application
          </Button>
        ) : null}

        {onCancel ? (
          <Button
            key="cancel-application-button"
            className="application-form-actions__btn application-form-actions__btn--cancel"
            aria-label="cancel"
            variant="contained"
            color="tertiary"
            onClick={() => onCancel()}
            data-testid="cancel-application-button"
          >
            Cancel
          </Button>
        ) : null}

        <Button
          key="submit-application-button"
          className="application-form-actions__btn application-form-actions__btn--continue"
          aria-label="Submit"
          variant="contained"
          color="primary"
          onClick={onContinue}
          data-testid="continue-application-button"
        >
          Continue
        </Button>

        {enableScroll ? <ScrollButton /> : null}
      </Box>
    </Box>
  );
};
