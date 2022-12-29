import { useState, createContext, useEffect } from "react";
import { IPowerUnit, VehiclesContextType } from "../types/managevehicles";
import { useVehiclesApi } from "../hooks/useVehiclesApi";

/*
 *
 * The Vehicle Context provides access to the Power Unit and Trailer data
 * for all of the Manage Vehicles components
 *
 */

export const VehiclesContext = createContext<VehiclesContextType>({
  powerUnitData: [],
  trailerData: [],
});

export const ManageVehiclesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  
  // Data
  const [powerUnitData, setPowerUnitData] = useState<IPowerUnit[]>([]);

  // Custom hook to fetch the data from the API
  const vehiclesApi = useVehiclesApi();

  // Fetch data from the API on initial render of Manage Vehicles
  useEffect(() => {
    const fetch = async () => {
      const data = await vehiclesApi.getAllPowerUnits();
      setPowerUnitData(data);
    };
    fetch();
  }, []);

  return (
    <VehiclesContext.Provider
      value={{
        powerUnitData,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
};
