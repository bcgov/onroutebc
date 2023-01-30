import { Routes, Route } from "react-router-dom";
import * as routes from "../constants/routes";

import { HomePage } from "../features/homePage/HomePage";
import { ManageProfiles } from "../features/manageProfile/ManageProfiles";
import { ManageVehicles } from "../features/manageVehicles/ManageVehicles";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.HOME} element={<HomePage />} />
      <Route path={routes.MANAGE_VEHICLES} element={<ManageVehicles />} />
      <Route path={routes.MANAGE_PROFILES} element={<ManageProfiles />} />
    </Routes>
  );
};
