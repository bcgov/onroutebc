import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VoidPermitResponseData } from "../types/VoidPermit";
import { voidPermit } from "../../../apiManager/permitsAPI";

export const useVoidPermit = () => {
  const [voidResults, setVoidResults] = useState<VoidPermitResponseData | undefined>(undefined);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: voidPermit,
    retry: false,
    onSuccess: (voidResponseData) => {
      queryClient.invalidateQueries(["permit"]);
      setVoidResults(voidResponseData);
    },
    onError: (err: unknown) => {
      console.error(err);
      setVoidResults(undefined);
    },
  });

  return {
    mutation,
    voidResults,
  };
};
