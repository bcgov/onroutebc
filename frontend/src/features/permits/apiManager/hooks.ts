import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../../../App";
import { submitTermOversize } from "./permitsAPI";

export const useSubmitTermOversizeMutation = () => {
  const queryClient = useQueryClient();
  const snackBar = useContext(SnackBarContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: submitTermOversize,
    onSuccess: (response) => {
      if (response.status === 201) {
        queryClient.invalidateQueries(["termOversize"]);

        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Term Oversize Permit has been submitted successfully",
          isError: false,
        });

        navigate("../");
      } else {
        // Display Error in the form.
      }
    },
  });
};
