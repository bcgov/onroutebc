import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { MRT_PaginationState, MRT_SortingState } from "material-react-table";
import {
  useQueryClient,
  useMutation,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import { Application, ApplicationFormData } from "../types/application";
import { IssuePermitsResponse } from "../types/permit";
import { StartTransactionResponseData } from "../types/payment";
import { APPLICATION_STEPS, ApplicationStep } from "../../../routes/constants";
import { isPermitTypeValid } from "../types/PermitType";
import { isPermitIdNumeric } from "../helpers/permitState";
import { deserializeApplicationResponse } from "../helpers/deserializeApplication";
import { deserializePermitResponse } from "../helpers/deserializePermit";
import { AmendPermitFormData } from "../pages/Amend/types/AmendPermitFormData";
import { Nullable, Optional } from "../../../common/types/common";
import {
  getApplicationByPermitId,
  getPermit,
  getPermitHistory,
  completeTransaction,
  createApplication,
  updateApplication,
  startTransaction,
  issuePermits,
  amendPermit,
  getCurrentAmendmentApplication,
  modifyAmendmentApplication,
  getApplicationsInProgress,
  resendPermit,
  getPendingPermits,
} from "../apiManager/permitsAPI";

const QUERY_KEYS = {
  PERMIT_DETAIL: (
    permitId?: Nullable<string>,
    companyId?: Nullable<string>,
  ) => ["permit", permitId, companyId],
  AMEND_APPLICATION: (
    originalPermitId?: Nullable<string>,
    companyId?: Nullable<string>,
  ) => ["amendmentApplication", originalPermitId, companyId],
  PERMIT_HISTORY: (
    originalPermitId?: Nullable<string>,
    companyId?: Nullable<string>,
  ) => ["permitHistory", originalPermitId, companyId],
};

/**
 * A custom react query mutation hook that saves the application data to the backend API
 * The hook checks for an existing application number to decide whether to send an update or create request
 */
export const useSaveApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      const res = data.permitId
        ? await updateApplication(data, data.permitId)
        : await createApplication(data);

      if (res.status === 200 || res.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ["application"],
        });

        return {
          application: deserializeApplicationResponse(res.data),
          status: res.status,
        };
      } else {
        return {
          application: null,
          status: res.status,
        };
      }
    },
  });
};

/**
 * A custom react query hook that get application details from the backend API
 * The hook gets application data by its permit ID
 * @param applicationStep The step of the application process (form, review, or pay)
 * @param permitId permit id for the application, if it exists
 * @param permitType permit type for the application, if it exists
 * @returns appropriate Application data, or error if failed
 */
export const useApplicationDetailsQuery = (
  applicationStep: ApplicationStep,
  permitId?: string,
  permitType?: string,
) => {
  const [applicationData, setApplicationData] =
    useState<Nullable<Application>>();

  // Check if the permit type param is valid, if there is one
  const permitTypeValid = isPermitTypeValid(permitType);

  const isCreateNewApplication =
    permitTypeValid && applicationStep === APPLICATION_STEPS.DETAILS;

  // Currently, creating new application route doesn't contain valid permitId
  // ie. route === "/applications/new/tros" instead of "/applications/:permitId"
  // Thus we need to do a check for valid/invalid routes
  // eg. "/applications/1" and "/applications/1/review" are VALID - they refer to existing application with id 1
  // eg. "/applications/new" is NOT VALID - doesn't provide permitType param
  // eg. "/applications/new/tros" is VALID - provides valid permitType param value
  // eg. "/applications/new/abcde" is NOT VALID - provided permitType is not valid
  // eg. "/applications/new/review" is NOT VALID - "new" is not a valid (numeric) permit id
  // We also need applicationStep to determine which page (route) we're on, and check the permit type route param
  const isInvalidRoute =
    !isPermitIdNumeric(permitId) && !isCreateNewApplication;
  const shouldEnableQuery = isPermitIdNumeric(permitId);

  // This won't fetch anything (ie. query.data will be undefined) if shouldEnableQuery is false
  const query = useQuery({
    queryKey: ["application"],
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
      const application = deserializeApplicationResponse(query.data);
      setApplicationData(application);
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
 * @returns UseQueryResult for permit query.
 */
export const usePermitDetailsQuery = (
  companyId: Nullable<string>,
  permitId?: Nullable<string>,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PERMIT_DETAIL(permitId, companyId),
    queryFn: async () => {
      const res = await getPermit(permitId, companyId);
      return res ? deserializePermitResponse(res) : res;
    },
    enabled: Boolean(permitId) && Boolean(companyId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
  });
};

/**
 * Custom hook that starts a transaction.
 * @returns The mutation object, as well as the transaction that was started (if there is one, or undefined if there's an error).
 */
export const useStartTransaction = () => {
  const [transaction, setTransaction] =
    useState<Nullable<StartTransactionResponseData>>(undefined);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: startTransaction,
    retry: false,
    onSuccess: (transactionData) => {
      queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });
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
  const [paymentApproved, setPaymentApproved] =
    useState<Optional<boolean>>(undefined);
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
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        });
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
 * @returns UseQueryResult of the fetch query.
 */
export const usePermitHistoryQuery = (
  originalPermitId?: Nullable<string>,
  companyId?: Nullable<string>,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PERMIT_HISTORY(originalPermitId, companyId),
    queryFn: () => getPermitHistory(originalPermitId, companyId),
    enabled: Boolean(originalPermitId) && Boolean(companyId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
  });
};

/**
 * Custom hook that issues the permits indicated by the application/permit ids.
 * @param ids Application/permit ids for the permits to be issued.
 * @returns Mutation object, and the issued results response.
 */
export const useIssuePermits = (companyIdParam?: Nullable<string>) => {
  const [issueResults, setIssueResults] =
    useState<Nullable<IssuePermitsResponse>>(undefined);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (applicationIds: string[]) =>
      issuePermits(applicationIds, companyIdParam),
    retry: false,
    onSuccess: (issueResponseData) => {
      queryClient.invalidateQueries({
        queryKey: ["application"],
      });
      setIssueResults(issueResponseData);
    },
    onError: (err: unknown) => {
      console.error(err);
      setIssueResults(null);
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
export const useAmendPermit = (companyIdParam?: Nullable<string>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AmendPermitFormData) => {
      const amendResult = await amendPermit(data, companyIdParam);
      if (amendResult.status === 200 || amendResult.status === 201) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PERMIT_DETAIL(data.permitId, companyIdParam),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.AMEND_APPLICATION(data.originalPermitId, companyIdParam),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PERMIT_HISTORY(data.originalPermitId, companyIdParam),
        });

        return {
          application: deserializeApplicationResponse(amendResult.data),
          status: amendResult.status,
        };
      }
      return {
        application: null,
        status: amendResult.status,
      };
    },
  });
};

export const useModifyAmendmentApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      application: AmendPermitFormData;
      applicationId: string;
      companyId: string;
    }) => {
      const amendResult = await modifyAmendmentApplication(data);

      if (amendResult.status === 200 || amendResult.status === 201) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.AMEND_APPLICATION(
            data.application.originalPermitId,
            data.companyId,
          ),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PERMIT_HISTORY(
            data.application.originalPermitId,
            data.companyId,
          ),
        });

        return {
          application: deserializeApplicationResponse(amendResult.data),
          status: amendResult.status,
        };
      }
      return {
        application: null,
        status: amendResult.status,
      };
    },
  });
};

/**
 * A custom react query hook that gets the current amendment application, if there is one.
 * @param originalPermitId Original permit id of the permit that is being amended.
 * @returns UseQueryResult of the fetch query.
 */
export const useAmendmentApplicationQuery = (
  originalPermitId?: Nullable<string>,
  companyId?: Nullable<string>,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.AMEND_APPLICATION(originalPermitId, companyId),
    queryFn: async () => {
      const res = await getCurrentAmendmentApplication(
        originalPermitId,
        companyId,
      );
      return res ? deserializeApplicationResponse(res) : res;
    },
    enabled: Boolean(originalPermitId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
  });
};

/**
 * A custom react query hook that fetches applications in progress and manages its pagination state.
 * @returns Query object containing fetched applications in progress, along with pagination state and setters
 */
export const useApplicationsInProgressQuery = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<MRT_SortingState>([
    {
      id: "updatedDateTime",
      desc: true,
    },
  ]);

  const orderBy = sorting.length > 0 ? [
    {
      column: sorting.at(0)?.id as string,
      descending: Boolean(sorting.at(0)?.desc),
    },
  ] : [];

  const applicationsInProgressQuery = useQuery({
    queryKey: ["applicationsInProgress", pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: () =>
      getApplicationsInProgress({
        page: pagination.pageIndex,
        take: pagination.pageSize,
        orderBy, 
      }),
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });

  return {
    applicationsInProgressQuery,
    pagination,
    setPagination,
    sorting,
    setSorting,
  };
};

/**
 * Hook that fetches pending permits and manages its pagination state.
 * @returns Pending permits along with pagination state and setter
 */
export const usePendingPermitsQuery = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: pendingPermits } = useQuery({
    queryKey: ["pendingPermits", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getPendingPermits({
        page: pagination.pageIndex,
        take: pagination.pageSize,
      }),
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });

  return {
    pendingPermits,
    pagination,
    setPagination,
  };
};

/**
 * Hook used for resending a permit.
 * @returns Mutation object to be used for resending a permit
 */
export const useResendPermit = () => {
  return useMutation({
    mutationFn: resendPermit,
  });
};
