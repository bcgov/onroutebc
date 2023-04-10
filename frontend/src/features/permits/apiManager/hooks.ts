import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../../../App";
import { submitTermOversize } from "./permitsAPI";

import { ReactElement, useState } from "react";

export const useMultiStepForm = (steps: ReactElement[]) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () => {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  };

  const back = () => {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  };

  const goTo = (index: number) => {
    setCurrentStepIndex(index);
  };

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back,
  };
};

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
