import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrbcError } from "./errorsAPI";

/**
 * Creates a error.
 * @returns newly created error
 */
export const useAddOrbcError = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOrbcError,
    onSuccess: (response) => {
      if (response.status === 201) {
        queryClient.invalidateQueries(["orbcError"]);
      } else {
        // Display Error in the form.
      }
    },
  });
};
