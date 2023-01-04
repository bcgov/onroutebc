import React, { useState } from "react";
// import { Button } from "../../../common/components/button/Button";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { TrailerForm } from "../form/TrailerForm";
import { useTranslation } from "react-i18next";
import { List } from "../list/List";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import AddVehicleSplitButton from "./AddVehicleSplitButton";
import { Vehicle } from "../../../constants/enums";
import "./Dashboard.scss";
import { Button } from "../../../common/components/button/Button";

export const Dashboard = React.memo(() => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [addVehicleMode, setAddVehicleMode] = useState<Vehicle | null>(null);

  /**
   * Closes the slide panel
   */
  const closeSlidePanel = () => {
    setShowForm(false);
    setAddVehicleMode(null);
  };

  const { t } = useTranslation();
  const title = (
    <>
      {/* <h2 className="slide-pane__title">{t("add-vehicle.power-unit")}</h2> */}
      <div className="slide-pane__header">
        <div className="slide-pane__title-wrapper">
          <h2 className="slide-pane__title">{t("add-vehicle.power-unit")}</h2>
          <div className="slide-pane__subtitle"></div>
        </div>

        <div className="slide-pane__close" role="button" tabIndex={0}>
          <button onClick={closeSlidePanel}>X</button>
        </div>
      </div>
    </>
  );
  return (
    <>
      <p>Manage Vehicles Dashboard</p>
      <AddVehicleSplitButton
        setFormMode={(mode: Vehicle) => setAddVehicleMode(mode)}
        openSlidePanel={setShowForm}
      />

      <List />

      <SlidingPane
        isOpen={showForm}
        onRequestClose={closeSlidePanel}
        from="right"
        width="28%"
        // title={title}
        title={t("add-vehicle.power-unit")}
        // subtitle="Sample"
        // closeIcon={<span aria-disabled={true}></span>}
        closeIcon="X"
      >
        {addVehicleMode === Vehicle.POWER_UNIT && <PowerUnitForm />}
        {addVehicleMode === Vehicle.TRAILER && <TrailerForm />}
        {/* <PowerUnitForm /> */}
      </SlidingPane>
    </>
  );
});

Dashboard.displayName = "Dashboard";
