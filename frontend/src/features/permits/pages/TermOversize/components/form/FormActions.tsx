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
    <Box className="tros-form-actions">
      {onLeave ? (
        <Button
          key="leave-application-button"
          className="tros-form-actions__btn tros-form-actions__btn--leave"
          aria-label="leave"
          variant="contained"
          color="secondary"
          onClick={onLeave}
          data-testid="leave-application-button"
        >
          Leave
        </Button>
      ) : null}

      <Box className="tros-form-actions__section tros-form-actions__section--main">
        {onSave ? (
          <Button
            key="save-TROS-button"
            className="tros-form-actions__btn tros-form-actions__btn--save"
            aria-label="save"
            variant="contained"
            color="tertiary"
            onClick={() => onSave()}
            data-testid="save-application-button"
          >
            <FontAwesomeIcon icon={faSave} />
            Save
          </Button>
        ) : null}

        {onCancel ? (
          <Button
            key="cancel-TROS-button"
            className="tros-form-actions__btn tros-form-actions__btn--cancel"
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
          key="submit-TROS-button"
          className="tros-form-actions__btn tros-form-actions__btn--continue"
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
