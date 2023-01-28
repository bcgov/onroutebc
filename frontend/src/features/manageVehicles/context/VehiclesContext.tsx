import { useState, createContext, useEffect, useMemo } from "react";
import { IPowerUnit, VehiclesContextType } from "../types/managevehicles";
import { getAllPowerUnits } from "../apiManager/vehiclesAPI";

/*
 *
 * THIS CONTEXT IS CURRENTLY NOT IN USE.
 * IT IS REPLACED BY TANSTACK REACT QUERY
 *
 */

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
  const powerUnitData = useMemo<IPowerUnit[]>(() => powerUnits, [powerUnits]);

  // Fetch data from the API on initial render of Manage Vehicles
  useEffect(() => {
    const fetch = async () => {
      const data = await getAllPowerUnits();
      setPowerUnits(data);
    };
    fetch();
  }, []);

  return (
    <>
      {/*tslint:disable-next-line*/}
      <VehiclesContext.Provider value={{ powerUnitData }}>
        {children}
      </VehiclesContext.Provider>
    </>
  );
};
