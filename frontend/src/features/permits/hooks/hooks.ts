import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { submitTermOversize } from "../apiManager/permitsAPI";

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
      } else {
        // Display Error in the form.
      }
    },
  });
};
