import React, { useState } from "react";
import { Button } from "../../../common/components/button/Button";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { List } from "../list/List";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import AddVehicleSplitButton from "./AddVehicleSplitButton";

export const Dashboard = React.memo(() => {
  const [showForm, setShowForm] = useState<boolean>(true);

  return (
    <>
      <p>Manage Vehicles Dashboard</p>
      <AddVehicleSplitButton />
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
        onRequestClose={() => setShowForm(false)}
        from="right"
        width="40%"
        hideHeader={true}
      >
        <PowerUnitForm />
      </SlidingPane>
    </>
  );
});

Dashboard.displayName = 'Dashboard';