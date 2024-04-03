import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { VehicleType } from "../types/Vehicle";
import {
  addPowerUnit,
  addTrailer,
  getAllVehicles,
  getPowerUnitSubTypes,
  getTrailerSubTypes,
  getVehicleById,
  updatePowerUnit,
  updateTrailer,
} from "./vehiclesAPI";
import { getCompanyIdFromSession } from "../../../common/apiManager/httpRequestHandler";
import { Nullable } from "../../../common/types/common";
import { getDefaultRequiredVal } from "../../../common/helpers/util";

/**
 * Fetches all vehicles.
 * @returns An array of vehicles (both Powerunits and Trailers)
 */
export const useVehiclesQuery = (companyIdParam?: Nullable<string>) => {
  const companyId = getDefaultRequiredVal(
    "",
    getCompanyIdFromSession(),
    companyIdParam,
  );
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getAllVehicles(companyId),
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries performed whenever page shows in foreground
  });
};

export const useVehicleByIdQuery = (
  companyId: string,
  vehicleType: VehicleType,
  vehicleId?: string,
) => {
  return useQuery({
    queryKey: ["vehicle", "vehicleId", "vehicleType"],
    queryFn: () => getVehicleById(companyId, vehicleType, vehicleId),
    retry: false,
    refetchOnMount: "always", // always fetch when component is mounted
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    enabled: Boolean(vehicleId), // does not perform the query at all if vehicle id is empty
  });
};

/**
 * Fetches a list of vehicle subtypes for Power Unit vehicles.
 * @returns List of vehicle subtypes for Power Unit vehicles
 */
export const usePowerUnitSubTypesQuery = () => {
  return useQuery({
    queryKey: ["powerUnitSubTypes"],
    queryFn: getPowerUnitSubTypes,
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
        queryClient.invalidateQueries({
          queryKey: ["powerUnits"],
        });
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
        queryClient.invalidateQueries({
          queryKey: ["powerUnits"],
        });
      } else {
        // Display Error in the form.
      }
    },
  });
};

/**
 * Fetches a list of vehicle subtypes for trailer vehicles.
 * @returns List of vehicle subtypes for trailer vehicles.
 */
export const useTrailerSubTypesQuery = () => {
  return useQuery({
    queryKey: ["trailerSubTypes"],
    queryFn: getTrailerSubTypes,
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
        queryClient.invalidateQueries({
          queryKey: ["trailers"],
        });
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
        queryClient.invalidateQueries({
          queryKey: ["trailers"],
        });
      } else {
        // Display Error in the form.
      }
    },
  });
};
