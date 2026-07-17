import { Button, Dialog } from "@mui/material";

import "./PermitNotRequiredModal.scss";
import { CustomExternalLink } from "../../../../../../common/components/links/CustomExternalLink";
import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../../../common/constants/constants";
import { ONROUTE_WEBPAGE_LINKS } from "../../../../../../routes/constants";

export const PermitNotRequiredModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    aria-labelledby="permit-not-required-modal-title"
    className="permit-not-required-modal"
    PaperProps={{
      className: "permit-not-required-modal__container",
    }}
  >
    <div className="permit-not-required-modal__header">
      <h2
        id="permit-not-required-modal-title"
        className="permit-not-required-modal__title"
      >
        This permit type is not required
      </h2>
    </div>

    <div className="permit-not-required-modal__body">
      <p className="permit-not-required-modal__text">
        Please note that you may require a different permit type.
      </p>
      <p className="permit-not-required-modal__text">
        Refer to the{" "}
        <CustomExternalLink
          href={ONROUTE_WEBPAGE_LINKS.COMMERCIAL_TRANSPORT_PROCEDURES}
          openInNewTab={true}
        >
          Commercial Transport Procedures Manual
        </CustomExternalLink>
        , or contact the Provincial Permit Centre at{" "}
        <strong>Toll-free: {TOLL_FREE_NUMBER}</strong> or{" "}
        <strong>Email: {PPC_EMAIL}</strong>
      </p>
    </div>

    <div className="permit-not-required-modal__footer">
      <Button
        className="permit-not-required-modal__button"
        variant="contained"
        color="secondary"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  </Dialog>
);
