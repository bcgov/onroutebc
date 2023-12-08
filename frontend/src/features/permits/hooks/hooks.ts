import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";

import { Application } from "../types/application";
import { mapApplicationResponseToApplication } from "../helpers/mappers";
import { IssuePermitsResponse, Permit } from "../types/permit";
import { PermitHistory } from "../types/PermitHistory";
import { StartTransactionResponseData } from "../types/payment";
import { FIVE_MINUTES } from "../../../common/constants/constants";
import { APPLICATION_STEPS, ApplicationStep } from "../../../routes/constants";
import {
  getApplicationByPermitId,
  getPermit,
  getPermitHistory,
  completeTransaction,
  submitTermOversize,
  updateTermOversize,
  startTransaction,
  issuePermits,
  amendPermit,
  getCurrentAmendmentApplication,
  modifyAmendmentApplication,
  getApplicationsInProgress,
} from "../apiManager/permitsAPI";
import { Nullable, Optional } from "../../../common/types/common";

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
        queryClient.setQueryData(["termOversize"], response.data);
        return response.data;
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
export const useApplicationDetailsQuery = (
  applicationStep: ApplicationStep,
  permitId?: string,
) => {
  const [applicationData, setApplicationData] = 
    useState<Nullable<Application>>();

  // Currently, creating new application route doesn't contain permitId
  // ie. route === "/applications/new" instead of "/applications/:permitId"
  // Thus we need to do a check
  // Also, "/applications/new" is valid, but "/applications/new/review" is invalid
  // Thus we also need applicationStep to determine which page (route) we're on
  const isCreateNewApplication = 
    typeof permitId === "undefined" && applicationStep === APPLICATION_STEPS.DETAILS;
  
  // Check if the permit id is numeric
  const isPermitIdNumeric = () => {
    if (!permitId) return false;
    if (permitId.trim() === "") return false;
    return !isNaN(Number(permitId.trim()));
  };

  const isInvalidRoute = !isPermitIdNumeric() && !isCreateNewApplication;
  const shouldEnableQuery = isPermitIdNumeric();

  // This won't fetch anything (ie. query.data will be undefined) if shouldEnableQuery is false
  const query = useQuery({
    queryKey: ["termOversize"],
    queryFn: () => getApplicationByPermitId(permitId),
    retry: false,
    refetchOnMount: "always", // always fetch when component is mounted (ApplicationDashboard page)
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    enabled: shouldEnableQuery, // does not perform the query at all if permit id is invalid
  });

  useEffect(() => {
    if (!shouldEnableQuery) {
      if (isInvalidRoute) {
        setApplicationData(null);
      } else {
        setApplicationData(undefined);
      }
    } else if (!query.data) {
      // query is enabled, set application data to whatever's being fetched
      setApplicationData(query.data);
    } else {
      const application = mapApplicationResponseToApplication(query.data);
      setApplicationData(
        application,
      );
    }
  }, [query.data, shouldEnableQuery, isInvalidRoute]);

  return {
    applicationData,
    setApplicationData,
    isInvalidRoute,
    shouldEnableQuery,
  };
};

/**
 * A custom react query hook that get permit details from the backend API
 * The hook gets permit details by its permit id
 * @param permitId permit id for the permit
 * @returns permit details, or error if failed
 */
export const usePermitDetailsQuery = (permitId?: string) => {
  const [permit, setPermit] = useState<Nullable<Permit>>(undefined);

  const invalidPermitId = !permitId;
  const query = useQuery({
    queryKey: ["permit"],
    queryFn: () => getPermit(permitId),
    enabled: !invalidPermitId,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    onSuccess: (permitDetails) => {
      setPermit(permitDetails);
    },
  });

  return {
    query,
    permit,
    setPermit,
  };
};

/**
 * Custom hook that starts a transaction.
 * @returns The mutation object, as well as the transaction that was started (if there is one, or undefined if there's an error).
 */
export const useStartTransaction = () => {
  const [transaction, setTransaction] = useState<
    Nullable<StartTransactionResponseData>
  >(undefined);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: startTransaction,
    retry: false,
    onSuccess: (transactionData) => {
      queryClient.invalidateQueries(["transaction"]);
      queryClient.setQueryData(["transaction"], transactionData);
      setTransaction(transactionData);
    },
    onError: (err: unknown) => {
      console.error(err);
      setTransaction(undefined);
    },
  });

  return {
    mutation,
    transaction,
  };
};

/**
 * A custom hook that completes the transaction.
 * @param messageText Message text that indicates the result of the transaction
 * @param paymentStatus Payment status signifying the result of the transaction (1 - success, 0 - failed)
 * @returns The mutation object, whether or not payment was approved, and the message to display
 */
export const useCompleteTransaction = (
  messageText: string,
  paymentStatus: number,
) => {
  const queryClient = useQueryClient();
  const [paymentApproved, setPaymentApproved] = useState<Optional<boolean>>(
    undefined,
  );
  const [message, setMessage] = useState<string>(messageText);

  const onTransactionResult = (message: string, paymentApproved: boolean) => {
    setMessage(message);
    setPaymentApproved(paymentApproved);
  };

  const onTransactionError = (err: unknown) => {
    if (!(err instanceof AxiosError)) {
      onTransactionResult("Unknown Error", false);
      return;
    }
    if (err.response) {
      onTransactionResult(
        `Payment approved but error in ORBC Backend: ${err.response.data.message}`,
        false,
      );
    } else {
      onTransactionResult("Request Error", false);
    }
  };

  const mutation = useMutation({
    mutationFn: completeTransaction,
    retry: false,
    onSuccess: (response) => {
      if (response != null) {
        queryClient.invalidateQueries(["transactions"]);
        onTransactionResult(messageText, paymentStatus === 1);
      } else {
        onTransactionResult("Something went wrong", false);
      }
    },
    onError: (err) => {
      onTransactionError(err);
    },
  });

  return {
    mutation,
    paymentApproved,
    message,
    setPaymentApproved,
    setMessage,
  };
};

/**
 * A custom react query hook that get permit history from the backend API
 * The hook gets permit history by its original permit id
 * @param originalPermitId original permit id for the permit
 * @returns list of permit history, or error if failed
 */
export const usePermitHistoryQuery = (originalPermitId?: string) => {
  const [permitHistory, setPermitHistory] = useState<PermitHistory[]>([]);

  const query = useQuery({
    queryKey: ["permitHistory"],
    queryFn: () => getPermitHistory(originalPermitId),
    enabled: originalPermitId != null,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    onSuccess: (permitHistoryData) => {
      setPermitHistory(permitHistoryData);
    },
  });

  return {
    query,
    permitHistory,
  };
};

/**
 * Custom hook that issues the permits indicated by the application/permit ids.
 * @param ids Application/permit ids for the permits to be issued.
 * @returns Mutation object, and the issued results response.
 */
export const useIssuePermits = () => {
  const [issueResults, setIssueResults] = useState<
    Optional<IssuePermitsResponse>
  >(undefined);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: issuePermits,
    retry: false,
    onSuccess: (issueResponseData) => {
      queryClient.invalidateQueries(["termOversize", "permit"]);
      setIssueResults(issueResponseData);
    },
    onError: (err: unknown) => {
      console.error(err);
      setIssueResults(undefined);
    },
  });

  return {
    mutation,
    issueResults,
  };
};

/**
 * A custom react query mutation hook that requests the backend API to amend the permit.
 */
export const useAmendPermit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Permit) => {
      return amendPermit(data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["permit"],
      });
      queryClient.invalidateQueries({
        queryKey: ["amendmentApplication"],
      });
      queryClient.invalidateQueries({
        queryKey: ["permitHistory"],
      });

      if (response.status === 200 || response.status === 201) {
        return response;
      }
      return undefined;
    },
  });
};

export const useModifyAmendmentApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: modifyAmendmentApplication,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["permit"],
      });
      queryClient.invalidateQueries({
        queryKey: ["amendmentApplication"],
      });
      queryClient.invalidateQueries({
        queryKey: ["permitHistory"],
      });
      if (response.status === 200 || response.status === 201) {
        return response;
      }
      return undefined;
    },
  });
};

/**
 * A custom react query hook that gets the current amendment application, if there is one.
 * @param originalPermitId Original permit id of the permit that is being amended.
 * @returns Current application used for amendment, or null/undefined
 */
export const useAmendmentApplicationQuery = (originalPermitId?: string) => {
  const [amendmentApplication, setAmendmentApplication] = useState<
    Nullable<Permit>
  >(undefined);

  const isIdInvalid = !originalPermitId;
  const query = useQuery({
    queryKey: ["amendmentApplication"],
    queryFn: () => getCurrentAmendmentApplication(originalPermitId),
    enabled: !isIdInvalid,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    onSuccess: (application) => {
      setAmendmentApplication(application);
    },
  });

  return {
    query,
    amendmentApplication,
  };
};

/**
 * A custom react query hook that fetches applications in progress.
 * @returns List of applications in progress
 */
export const useApplicationsInProgressQuery = () => {
  const applicationsInProgressQuery = useQuery({
    queryKey: ["applicationInProgress"],
    queryFn: getApplicationsInProgress,
    keepPreviousData: true,
    staleTime: FIVE_MINUTES,
  });

  return {
    applicationsInProgressQuery,
  };
};
