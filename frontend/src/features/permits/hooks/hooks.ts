import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  getApplicationInProgressById,
  submitTermOversize,
  updateTermOversize,
} from "../apiManager/permitsAPI";
import { Application } from "../types/application";
import { useState } from "react";
import { mapApplicationResponseToApplication } from "../helpers/mappers";

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
 * A custom react query hook that get application details from the backend API
 * The hook gets application data by its permit ID
 */
export const useApplicationDetailsQuery = (permitId?: string) => {
  const [applicationData, setApplicationData] = useState<Application | undefined>(undefined);
  
  const query = useQuery({
    queryKey: ["termOversize"],
    queryFn: () => getApplicationInProgressById(permitId),
    retry: false,
    refetchOnMount: "always",
    //enabled: !!permitId,
    onSuccess: (application) => {
      if (!application) {
        setApplicationData(undefined);
      } else {
        setApplicationData(
          mapApplicationResponseToApplication(application)
        );
      }
    },
  });

  return {
    query,
    applicationData,
    setApplicationData,
  };
};
