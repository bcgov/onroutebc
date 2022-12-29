import { useState, createContext, useEffect, useMemo } from "react";
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
  const [powerUnits, setPowerUnits] = useState<IPowerUnit[]>([]);

  // React Context Provider values should not have non-stable identities
  // Wrapping the value in a useMemo hook will avoid additional render passes.
  const powerUnitData = useMemo<IPowerUnit[]>(() : IPowerUnit[] => {
    return powerUnits;
  }, [powerUnits]);

  // Custom hook to fetch the data from the API
  const vehiclesApi = useVehiclesApi();

  // Fetch data from the API on initial render of Manage Vehicles
  useEffect(() => {
    const fetch = async () => {
      const data = await vehiclesApi.getAllPowerUnits();
      setPowerUnits(data);
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
