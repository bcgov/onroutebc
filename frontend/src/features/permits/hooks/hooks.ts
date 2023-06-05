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
 * @param permitId permit id for the application, if it exists
 * @returns appropriate Application data, or error if failed
 */
export const useApplicationDetailsQuery = (permitId?: string) => {
  const [applicationData, setApplicationData] = useState<Application | undefined>(undefined);
  
  // Currently, creating new application route doesn't contain permitId
  // ie. route === "/applications/permits" instead of "/applications/:permitId"
  // Thus we need to do a check
  const isPermitIdValid = permitId != null && !isNaN(Number(permitId));
  
  const query = useQuery({
    queryKey: ["termOversize"],
    queryFn: () => getApplicationInProgressById(permitId),
    retry: false,
    refetchOnMount: "always", // always fetch when component is mounted (ApplicationDashboard page)
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    enabled: isPermitIdValid, // does not perform the query at all if permit id is invalid
    onSuccess: (application) => {
      if (!application) {
        // set to undefined when application not found
        setApplicationData(undefined);
      } else {
        // if found, convert to ApplicationResponse object to Application (date string values to Dayjs objects to be used for date inputs)
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
