import { useState, createContext } from "react";
import {
  IPowerUnit,
  ManageVehiclesContextType,
} from "../@types/managevehicles";

export const ManageVehiclesContext = createContext<ManageVehiclesContextType>({
  powerUnitData: [],
  setPowerUnitData: null,
  trailerData: [],
  isError: false,
  setIsError: null,
  isLoading: false,
  setIsLoading: null,
  isRefetching: false,
  setIsRefetching: null,
  rowCount: 0,
  setRowCount: null,
});

export const ManageVehiclesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  
  //data and fetching state
  const [powerUnitData, setPowerUnitData] = useState<IPowerUnit[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  return (
    <ManageVehiclesContext.Provider
      value={{
        powerUnitData,
        setPowerUnitData,
        isError,
        setIsError,
        isLoading,
        setIsLoading,
        isRefetching,
        setIsRefetching,
        rowCount,
        setRowCount,
      }}
    >
      {children}
    </ManageVehiclesContext.Provider>
  );
};
