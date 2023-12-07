import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Vehicle, VehicleTypesAsString } from "../types/managevehicles";
import {
  addPowerUnit,
  addTrailer,
  getAllVehicles,
  getPowerUnitTypes,
  getTrailerTypes,
  getVehicleById,
  updatePowerUnit,
  updateTrailer,
} from "./vehiclesAPI";

/**
 * Fetches all vehicles.
 * @returns An array of vehicles (both Powerunits and Trailers)
 */
export const useVehiclesQuery = (companyId: string) => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getAllVehicles(companyId),
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries performed whenever page shows in foreground
  });
};

export const useVehicleByIdQuery = (
  companyId: string, 
  vehicleType: VehicleTypesAsString, 
  vehicleId?: string
) => {
  const [vehicle, setVehicle] = useState<Vehicle | null | undefined>();

  const query = useQuery({
    queryKey: ["vehicle", "vehicleId", "vehicleType"],
    queryFn: () => getVehicleById(companyId, vehicleType, vehicleId),
    retry: false,
    refetchOnMount: "always", // always fetch when component is mounted
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    enabled: !!vehicleId, // does not perform the query at all if vehicle id is empty
    onSuccess: (vehicleData) => {
      setVehicle(vehicleData);
    },
  });

  return {
    vehicleByIdQuery: query,
    vehicle,
  };
};

/**
 * Fetches a list of vehicle subtypes for PowerUnit vehicles.
 * @returns List of vehicle subtypes for PowerUnit vehicles
 */
export const usePowerUnitTypesQuery = () => {
  return useQuery({
    queryKey: ["powerUnitTypes"],
    queryFn: getPowerUnitTypes,
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries
  });
};

/**
 * Creates a PowerUnit vehicle.
 * @returns newly created PowerUnit vehicle, or error when fails
 */
export const useAddPowerUnitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPowerUnit,
    onSuccess: (response) => {
      if (response.status === 201) {
        queryClient.invalidateQueries(["powerUnits"]);
      } else {
        // Display Error in the form.
      }
    },
  });
};

/**
 * Updates an existing PowerUnit vehicle.
 * @returns updated PowerUnit vehicle, or error when fails
 */
export const useUpdatePowerUnitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePowerUnit,
    onSuccess: (response) => {
      if (response.status === 200) {
        queryClient.invalidateQueries(["powerUnits"]);
      } else {
        // Display Error in the form.
      }
    },
  });
};

/**
 * Fetches a list of vehicle subtypes for trailer vehicles.
 * @returns list of vehicle subtypes for trailer vehicles
 */
export const useTrailerTypesQuery = () => {
  return useQuery({
    queryKey: ["trailerTypes"],
    queryFn: getTrailerTypes,
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries
  });
};

/**
 * Creates a trailer vehicle.
 * @returns newly created trailer vehicle, or error if failed
 */
export const useAddTrailerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTrailer,
    onSuccess: (response) => {
      if (response.status === 200) {
        queryClient.invalidateQueries(["trailers"]);
      } else {
        // Display Error in the form.
      }
    },
  });
};

/**
 * Updates an existing trailer vehicle.
 * @returns updated trailer vehicle, or error if failed
 */
export const useUpdateTrailerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTrailer,
    onSuccess: (response) => {
      if (response.status === 200) {
        queryClient.invalidateQueries(["trailers"]);
      } else {
        // Display Error in the form.
      }
    },
  });
};
