import { Button, Dialog } from "@mui/material";
import "./AxleUnitHelpModal.scss";

export const AxleUnitHelpModal = ({
  isOpen,
  onCancel,
  onClose,
}: {
  /**
   * Boolean to control the open and close state of Dialog box.
   */
  isOpen: boolean;
  /**
   * A callback function on clicking cancel button.
   * @returns void
   */
  onCancel: () => void;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="axle-unit-help-modal"
      PaperProps={{
        className: "axle-unit-help-modal__container",
      }}
    >
      <div className="axle-unit-help-modal__header">
        <h2 className="axle-unit-help-modal__title">
          Information about Axle Unit and Axle Group
        </h2>
      </div>

      <div className="axle-unit-help-modal__body">
        <h4 className="axle-unit-help-modal__heading">
          Axle Unit: Can have one or more axles.
        </h4>
        <div className="axle-unit-help-modal__row axle-unit-help-modal__row--top">
          <div className="axle-unit-help-modal__section">
            <strong>Example 1:</strong>
            <p className="section__text">
              A single steer and tandem drive truck tractor would have 2 axle
              units.
            </p>
            <img
              className="section__image"
              src="/Axle_Unit_01.svg"
              alt="Single steer and tandem drive shown as two axle units in one axle group"
            />
          </div>
          <div className="axle-unit-help-modal__section">
            <strong>Example 2:</strong>
            <p className="section__text">
              A tandem steer and tridem drive truck tractor would have 2 axle
              units.
            </p>
            <img
              className="section__image"
              src="/Axle_Unit_02.svg"
              alt="Tandem steer and tridem drive shown as two axle units in one axle group"
            />
          </div>
        </div>
        <h4 className="axle-unit-help-modal__heading">
          Axle Group: Combination of Axle Units
        </h4>
      </div>

      <div className="axle-unit-help-modal__footer">
        <Button
          className="axle-unit-help-modal__button"
          variant="contained"
          color="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </Dialog>
  );
};
