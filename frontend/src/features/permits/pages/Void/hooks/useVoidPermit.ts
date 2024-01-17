import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VoidPermitResponseData } from "../types/VoidPermit";
import { voidPermit } from "../../../apiManager/permitsAPI";
import { Nullable } from "../../../../../common/types/common";

export const useVoidPermit = () => {
  const [voidResults, setVoidResults] =
    useState<Nullable<VoidPermitResponseData>>(undefined);

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
      setVoidResults(null);
    },
  });

  return {
    mutation,
    voidResults,
  };
};
