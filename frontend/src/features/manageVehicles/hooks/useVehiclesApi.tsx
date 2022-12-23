import { useContext } from "react";
import { ManageVehiclesContext } from "../context/ManageVehiclesContext";

// context consumer hook
export const useVehiclesApi = () => {
  // get the context
  const mvContext = useContext(ManageVehiclesContext);

  // if `undefined`, throw an error
  if (mvContext === undefined) {
    throw new Error("useVehiclesApi was used outside of its Provider");
  }

  /**
   * Fetch*
   All Power Unit Data
   * @return {*}  {Promise<void>}
   */
  const getAllPowerUnits = async (): Promise<void> => {

    if (!mvContext.powerUnitData.length) {
      mvContext.setIsLoading(true);
    } else {
      mvContext.setIsRefetching(true);
    }

    const url = new URL(
      "/vehicles/powerUnit",
      process.env.NODE_ENV === "production"
        ? "http://localhost:5000"
        : "http://localhost:5000"
    );

    try {
      const response = await fetch(url.href);
      const json = (await response.json());
      mvContext.setPowerUnitData(json);
      mvContext.setRowCount(json.length);
    } catch (error) {
      mvContext.setIsError(true);
      console.error(error);
      return;
    }
    mvContext.setIsError(false);
    mvContext.setIsLoading(false);
    mvContext.setIsRefetching(false);
  };

  return {getAllPowerUnits};
};
