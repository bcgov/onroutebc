import React, { useState } from "react";
// import { Button } from "../../../common/components/button/Button";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { useTranslation } from "react-i18next";
import { List } from "../list/List";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import AddVehicleSplitButton from "./AddVehicleSplitButton";
import { Vehicle } from "../../../constants/enums";

export const Dashboard = React.memo(() => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const [addVehicleMode, setAddVehicleMode] = useState<Vehicle | null>(null);

  /**
   * Closes the slide panel
   */
  const closeSlidePanel = () => {
    setShowForm(false);
    setAddVehicleMode(null);
  }

  const { t } = useTranslation();
  return (
    <>
      <p>Manage Vehicles Dashboard</p>
      <AddVehicleSplitButton
          setFormMode={(mode: Vehicle) => setAddVehicleMode(mode)}
      />
      {/* <ButtonGroup variant="contained" aria-label="split button">
        <Button color={"BC-Gov-PrimaryButton"} onClick={() => setShowForm(true)}>
          Power Unit
        </Button>
        <Button color={"BC-Gov-PrimaryButton"} onClick={() => setShowForm(true)}>
          Trailer
        </Button>
        <ArrowDropDownIcon />
      </ButtonGroup> */}

      <List />

      <SlidingPane
        isOpen={showForm}
        onRequestClose={closeSlidePanel}
        from="right"
        width="40%"
        title={t("add-vehicle.power-unit")}
        closeIcon="X"
      >
        <PowerUnitForm />
      </SlidingPane>
    </>
  );
});

Dashboard.displayName = 'Dashboard';