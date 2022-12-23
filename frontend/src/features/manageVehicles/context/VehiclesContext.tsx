import { useState, createContext, useEffect } from "react";
import { IPowerUnit, VehiclesContextType } from "../@types/managevehicles";
import { useVehiclesApi } from "../hooks/useVehiclesApi";

export const VehiclesContext = createContext<VehiclesContextType>({
  powerUnitData: [],
  trailerData: [],
});

export const ManageVehiclesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  
  //data and fetching state
  const [powerUnitData, setPowerUnitData] = useState<IPowerUnit[]>([]);

  // custom hooks
  const vehiclesApi = useVehiclesApi();

  useEffect(() => {
    const fetch = async () => {
      console.log("Fetch");
      const refreshed = await vehiclesApi.getAllPowerUnits();
      setPowerUnitData(refreshed);
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
