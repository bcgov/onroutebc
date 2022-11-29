import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../common/components/button/Button';
import * as routes from '../../../constants/routes';
import { List } from '../list/List';

export const Dashboard = React.memo(() => {

  const navigate = useNavigate()

  const handleCreateNew = () => {
    navigate("./new");
  };

  return (
    <div>
      <p>Manage Vehicles Dashboard</p>
      <Button label="Create" color={"BC-Gov-PrimaryButton"} onClick={handleCreateNew}>Create New</Button>
      <List/>
    </div>
  );
});
