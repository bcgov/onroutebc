import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AxiosError } from "axios";

import { Application } from "../types/application";
import { mapApplicationResponseToApplication } from "../helpers/mappers";
import { ReadPermitDto } from "../types/permit";
import { PermitHistory } from "../types/PermitHistory";
import {
  getApplicationByPermitId,
  getPermit,
  getPermitHistory,
  completeTransaction,
  submitTermOversize,
  updateTermOversize,
  startTransaction,
} from "../apiManager/permitsAPI";

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
    queryFn: () => getApplicationByPermitId(permitId),
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

/**
 * A custom react query hook that get permit details from the backend API
 * The hook gets permit details by its permit id
 * @param permitId permit id for the permit
 * @returns permit details, or error if failed
 */
export const usePermitDetailsQuery = (permitId: string) => {
  const [permit, setPermit] = useState<ReadPermitDto | null>(null);
  
  const query = useQuery({
    queryKey: ["permit"],
    queryFn: () => getPermit(permitId),
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
 * @param paymentMethodId - Id of payment method to use (currently hardcoded to 1).
 * @param transactionSubmitDate - The datetime when this transaction is started.
 * @param transactionAmount - The amount of the transaction.
 * @param permitIds - The permit ids that this transaction will pay for.
 * @returns The queried transaction object (if there is one), as well as method to enable querying
 */
export const useStartTransaction = (
  paymentMethodId: number,
  transactionSubmitDate: string,
  transactionAmount: number,
  permitIds: string[]
) => {
  const [enableQuery, setEnableQuery] = useState<boolean>(false);

  const query = useQuery({
    queryKey: ["transaction"],
    queryFn: () => startTransaction(
      paymentMethodId, 
      transactionSubmitDate, 
      transactionAmount, 
      permitIds
    ),
    enabled: enableQuery, // only query when enableQuery is true
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
  });

  /*
  // Use this once the backend has been updated to use POST instead of GET
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => startTransaction(
      paymentMethodId, 
      transactionSubmitDate, 
      transactionAmount, 
      permitIds
    ),
    retry: false,
    onSuccess: (transactionData) => {
      queryClient.invalidateQueries(["transaction"]);
      queryClient.setQueryData(["transaction"], transactionData);
      setTransaction(transactionData);
    },
    onError: (err: unknown) => {
      console.error(err);
    },
  });
  */

  return {
    query,
    // mutation,
    setEnableQuery,
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
  paymentStatus: number
) => {
  const queryClient = useQueryClient();
  const [paymentApproved, setPaymentApproved] = useState<boolean | undefined>(undefined);
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
        false
      );
    } else {
      onTransactionResult("Request Error", false);
    }
  };

  const mutation = useMutation({
    mutationFn: completeTransaction,
    retry: false,
    onSuccess: (response) => {
      if (response.status === 201) {
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
