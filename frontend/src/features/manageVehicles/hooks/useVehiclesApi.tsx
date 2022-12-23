import { useContext } from "react";
import { IPowerUnit } from "../@types/managevehicles";
import { VehiclesContext } from "../context/VehiclesContext";
import { VEHICLES_API } from "./endpoints/endpoints";

// context consumer hook
export const useVehiclesApi = () => {

  /**
   * Fetch*
   All Power Unit Data
   * @return {*}  {Promise<void>}
   */
  const getAllPowerUnits = async (): Promise<IPowerUnit[]> => {

    const url = new URL(VEHICLES_API.GET_ALL_POWER_UNITS);

    try {
      const response = await fetch(url.href);
      const json = (await response.json());
      return json;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return {getAllPowerUnits};
};
