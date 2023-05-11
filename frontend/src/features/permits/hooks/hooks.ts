import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  submitTermOversize,
  updateTermOversize,
} from "../apiManager/permitsAPI";
import { Application } from "../types/application";

/**
 * A custom react query mutation hook that submits the application data to the backend API
 * then shows a snackbar and navigates back a page
 */
export const useSubmitTermOversizeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitTermOversize,
    onSuccess: (response) => {
      if (response.status === 201) {
        queryClient.invalidateQueries(["termOversize"]);
        queryClient.setQueryData(["termOversize"], response);
        return response;
      } else {
        // Display Error in the form.
      }
    },
  });
};

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
      if (response.status === 201) {
        queryClient.invalidateQueries(["termOversize"]);
        queryClient.setQueryData(["termOversize"], response);
        return response;
      } else {
        // Display Error in the form.
      }
    },
  });
};
