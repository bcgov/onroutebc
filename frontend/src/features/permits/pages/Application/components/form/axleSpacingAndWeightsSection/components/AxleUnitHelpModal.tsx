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
          The difference between an Axle Unit and No. of Axles.
        </h2>
      </div>

      <div className="axle-unit-help-modal__body">
        <h4 className="axle-unit-help-modal__heading">
          Axle Unit: Can have one or more axles.
        </h4>
        <div className="axle-unit-help-modal__row axle-unit-help-modal__row--top">
          <div className="axle-unit-help-modal__section">
            <p className="section__text">
              A single steer and tandem drive truck tractor would have 2 axle
              units.
            </p>
            <img
              className="section__image"
              src="/Axle_Unit_01.svg"
              alt="Example showing axle units"
            />
          </div>
          <div className="axle-unit-help-modal__section">
            <p className="section__text">
              A tandem steer and tridem drive truck tractor would have 2 axle
              units.
            </p>
            <img
              className="section__image"
              src="/Axle_Unit_02.svg"
              alt="Example showing axle units"
            />
          </div>
        </div>
        <h4 className="axle-unit-help-modal__heading">
          No. of Axles: Total axles within an axle unit.
        </h4>
        <div className="axle-unit-help-modal__row">
          <div className="axle-unit-help-modal__section">
            <p className="section__text">
              A single steer and tandem drive truck tractor would have 1 and 2
              axles respectively.
            </p>
            <img
              className="section__image"
              src="/Number_Of_Axles_01.svg"
              alt="Example showing number of axles"
            />
          </div>
          <div className="axle-unit-help-modal__section">
            <p className="section__text">
              A tandem steer and tridem drive truck tractor would have 2 and 3
              axles respectively.
            </p>
            <img
              className="section__image"
              src="/Number_Of_Axles_02.svg"
              alt="Example showing number of axles"
            />
          </div>
        </div>
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
