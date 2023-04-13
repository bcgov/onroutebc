import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../../../App";
import { getUserContext } from "../../manageProfile/apiManager/manageProfileAPI";
import {
  addPowerUnit,
  addTrailer,
  getPowerUnitTypes,
  getTrailerTypes,
} from "./vehiclesAPI";

export const usePowerUnitTypesQuery = () => {
  return useQuery({
    queryKey: ["powerUnitTypes"],
    queryFn: getPowerUnitTypes,
    retry: false,
  });
};

export const useUserContext = () => {
  return useQuery({
    queryKey: ["userContext"],
    queryFn: getUserContext,
    onSuccess: (userContextResponseBody) => {
      console.log(userContextResponseBody);
      sessionStorage.setItem("onroutebc.user.context", JSON.stringify(userContextResponseBody));
    },
    retry: false,
  });
}

export const useAddPowerUnitMutation = () => {
  const queryClient = useQueryClient();
  const snackBar = useContext(SnackBarContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: addPowerUnit,
    onSuccess: (response) => {
      if (response.status === 201) {
        queryClient.invalidateQueries(["powerUnits"]);

        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Power unit has been added successfully",
          isError: false,
        });

        navigate("../");
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
  });
};

export const useAddTrailerMutation = () => {
  const queryClient = useQueryClient();
  const snackBar = useContext(SnackBarContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: addTrailer,
    onSuccess: (response) => {
      if (response.status === 201) {
        queryClient.invalidateQueries(["trailers"]);

        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Trailer has been added successfully",
          isError: false,
        });

        navigate("../");
      } else {
        // Display Error in the form.
      }
    },
  });
};
