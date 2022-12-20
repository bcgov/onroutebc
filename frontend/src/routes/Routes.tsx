import React from 'react';
import { Routes, Route } from "react-router-dom";

import { ManageVehicles } from '../features/manageVehicles/ManageVehicles';
import { HomePage } from '../features/homePage/HomePage';

import * as routes from '../constants/routes';

export const AppRoutes = () => {

  return (
    <div className="feature-container">
        <Routes>
            <Route path={routes.HOME} element={<HomePage/>}/>
            <Route path={routes.MANAGE_VEHICLES} element={<ManageVehicles/>}/>
        </Routes>
    </div>
  );
};