import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPowerUnit,
  addTrailer,
  getAllVehicles,
  getPowerUnit,
  getPowerUnitTypes,
  getTrailerTypes,
  updatePowerUnit,
  updateTrailer,
} from "./vehiclesAPI";

/**
 *
 * @returns An array of Powerunits and Trailers
 */
export const useVehiclesQuery = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: getAllVehicles,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useVehicleByIdQuery = (powerUnitId: string) => {
  return useQuery(
    ["powerUnitById", powerUnitId],
    () => getPowerUnit(powerUnitId),
    { retry: false }
  );
};

export const usePowerUnitTypesQuery = () => {
  return useQuery({
    queryKey: ["powerUnitTypes"],
    queryFn: getPowerUnitTypes,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

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

export const useTrailerTypesQuery = () => {
  return useQuery({
    queryKey: ["trailerTypes"],
    queryFn: getTrailerTypes,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

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

export const useUpdateTrailerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTrailer,
    onSuccess: (response: Response) => {
      if (response.status === 200) {
        queryClient.invalidateQueries(["trailers"]);
      } else {
        // Display Error in the form.
      }
    },
  });
};
