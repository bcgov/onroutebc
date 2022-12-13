import React, { useState } from "react";
import { Button } from "../../../common/components/button/Button";
import { VehicleForm } from "../form/VehicleForm";
import { List } from "../list/List";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

export const Dashboard = React.memo(() => {
  const [showForm, setShowForm] = useState<boolean>(false);

  return (
    <>
      <p>Manage Vehicles Dashboard</p>
      <Button color={"BC-Gov-PrimaryButton"} onClick={() => setShowForm(true)}>
        Create New
      </Button>
      <List />

      <SlidingPane
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        from="right"
        width="40%"
        hideHeader={true}
      >
        <VehicleForm />
      </SlidingPane>
    </>
  );
});

Dashboard.displayName = 'Dashboard';