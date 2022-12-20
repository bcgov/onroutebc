import { useState, createContext } from "react";
import { IPowerUnit, ManageVehiclesContextType } from "../@types/managevehicles";

export const ManageVehiclesContext = createContext<ManageVehiclesContextType | null>(null);

const sampleData: IPowerUnit[] = [
  {
    id: 1,
    unit: "Ken10",
    make: "Kenworth",
    vin: "12345678",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
    dateCreated: "2022-12-19",
  },
  {
    id: 2,
    unit: "Ken10",
    make: "Kenworth",
    vin: "12345678",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
    dateCreated: "2022-12-19",
  },
  {
    id: 3,
    unit: "Ken10",
    make: "Kenworth",
    vin: "12345678",
    plate: "ABC123",
    subtype: "Truck Tractor",
    year: 2010,
    country: "Canada",
    gvw: 19000,
    isActive: false,
    dateCreated: "2022-12-19",
  },
];

export const ManageVehiclesProvider = ({ children } : { children: React.ReactNode } ) => {
  const [powerUnitData] = useState<IPowerUnit[]>(sampleData);

  return (
    <ManageVehiclesContext.Provider value={{ powerUnitData }}>{children}</ManageVehiclesContext.Provider>
  );
};
