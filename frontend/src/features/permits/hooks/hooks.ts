import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getApplicationInProgressById,
  submitTermOversize,
  updateTermOversize,
} from "../apiManager/permitsAPI";
import { Application } from "../types/application";
import dayjs from "dayjs";

/**
 * A custom react query mutation hook that saves the application data to the backend API
 * The hook checks for an existing application number to decide whether to send an Update or Create request
 */
export const useSaveTermOversizeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Application) => {
      
      if (data.applicationNumber) {
        return updateTermOversize(data, data.applicationNumber);
      } else {
        return submitTermOversize(data);
      }
    },
    onSuccess: (response) => {
      if (response.status === 200 || response.status === 201) {
        queryClient.invalidateQueries(["termOversize"]);
        queryClient.setQueryData(["termOversize"], response);
        return response;
      } else {
        // Display Error in the form.
      }
    },
  });
};

/**
 * A custom react query mutation hook that get application details to the backend API
 * The hook gets application data by its permit ID
 */
export const useApplicationDetailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (permitId: string) => {
      return getApplicationInProgressById(permitId);
    },
    onSuccess: (response) => {
      if (response !== undefined) {
        queryClient.invalidateQueries(["termOversize"]);
        queryClient.setQueryData(["termOversize"], response);
        return response;
      } else {
        // Display Error in the form.
      }
    },
  });
};
