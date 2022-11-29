import React from 'react';
import { Routes, Route } from "react-router-dom";

import { Dashboard } from '../features/manageVehicles/dashboard/Dashboard';
import { HomePage } from '../features/homePage/HomePage';

import * as routes from '../constants/routes';
import { VehicleForm } from '../features/manageVehicles/form/VehicleForm';



export const AppRoutes = () => {

  return (
    <div className="feature-container">
        <Routes>
            <Route path={routes.HOME} element={<HomePage/>}/>
            <Route path={routes.MANAGE_VEHICLES}>
              <Route index element={<Dashboard/>}/>
              <Route path="new" element={<VehicleForm/>}/>
            </Route>
            {/* TODO: add a 404 route */}
        </Routes>
    </div>
  );
};