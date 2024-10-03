import { useContext } from "react";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { IDIRUserRoleType } from "../../../common/authentication/types";
import { canViewApplicationQueue } from "../helpers/canViewApplicationQueue";
import { MRT_PaginationState, MRT_SortingState } from "material-react-table";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  claimApplicationInQueue,
  getApplicationInQueueDetails,
  getApplicationsInQueue,
  getClaimedApplicationsInQueue,
  getUnclaimedApplicationsInQueue,
  updateApplicationQueueStatus,
} from "../apiManager/queueAPI";
import { Nullable } from "../../../common/types/common";
import { SnackBarContext } from "../../../App";
import { CASE_ACTIVITY_TYPES } from "../types/CaseActivityType";
import { AxiosError } from "axios";
import { useTableControls } from "../../permits/hooks/useTableControls";

const QUEUE_QUERY_KEYS_BASE = "queue";

const QUEUE_QUERY_KEYS = {
  ALL: (pagination: MRT_PaginationState, sorting: MRT_SortingState) => [
    [QUEUE_QUERY_KEYS_BASE, pagination, sorting],
  ],
  CLAIMED: (pagination: MRT_PaginationState, sorting: MRT_SortingState) => [
    [QUEUE_QUERY_KEYS_BASE, pagination, sorting],
  ],
  UNCLAIMED: (pagination: MRT_PaginationState, sorting: MRT_SortingState) => [
    [QUEUE_QUERY_KEYS_BASE, pagination, sorting],
  ],
  DETAIL: (applicationNumber: string) => [
    QUEUE_QUERY_KEYS_BASE,
    { applicationNumber },
  ],
};

/**
 * Hook that fetches all applications in queue (PENDING_REVIEW, IN_REVIEW) for staff and manages its pagination state.
 * This is the data that is consumed by the ApplicationsInReviewList component.
 * @returns All applications in queue(PENDING_REVIEW, IN_REVIEW) along with pagination state and setter
 */
export const useApplicationsInQueueQuery = () => {
  const { idirUserDetails, companyId } = useContext(OnRouteBCContext);
  const userRole = idirUserDetails?.userRole as IDIRUserRoleType;

  // if typeof company === "undefined" here we know that the staff user is NOT acting as a company
  const getStaffQueue =
    canViewApplicationQueue(userRole) && typeof companyId === "undefined";

  const { pagination, setPagination, sorting, setSorting, orderBy } =
    useTableControls();

  const applicationsInQueueQuery = useQuery({
    queryKey: QUEUE_QUERY_KEYS.ALL(pagination, sorting),
    queryFn: () =>
      getApplicationsInQueue(
        {
          page: pagination.pageIndex,
          take: pagination.pageSize,
          orderBy,
        },
        getStaffQueue,
      ),
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });

  return {
    applicationsInQueueQuery,
    pagination,
    setPagination,
    sorting,
    setSorting,
  };
};

/**
 * Hook that fetches all claimed applications in queue (IN_REVIEW) for staff and manages its pagination state.
 * This is the data that is consumed by the ClaimedApplicationsList component
 * @returns All claimed applications in queue (IN_REVIEW) along with pagination state and setter
 */
export const useClaimedApplicationsInQueueQuery = () => {
  const { pagination, setPagination, sorting, setSorting, orderBy } =
    useTableControls({ pageSize: 25 });

  const claimedApplicationsInQueueQuery = useQuery({
    queryKey: QUEUE_QUERY_KEYS.CLAIMED(pagination, sorting),
    queryFn: () =>
      getClaimedApplicationsInQueue({
        page: pagination.pageIndex,
        take: pagination.pageSize,
        orderBy,
      }),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });

  return {
    claimedApplicationsInQueueQuery,
    pagination,
    setPagination,
    sorting,
    setSorting,
  };
};

/**
 * Hook that fetches all unclaimed applications in queue (PENDING_REVIEW) for staff and manages its pagination state.
 * This is the data that is consumed by the ApplicationsInQueueList component
 * @returns All unclaimed applications in queue (PENDING_REVIEW) along with pagination state and setter
 */
export const useUnclaimedApplicationsInQueueQuery = () => {
  const { pagination, setPagination, sorting, setSorting, orderBy } =
    useTableControls({ pageSize: 25 });

  const unclaimedApplicationsInQueueQuery = useQuery({
    queryKey: QUEUE_QUERY_KEYS.UNCLAIMED(pagination, sorting),
    queryFn: () =>
      getUnclaimedApplicationsInQueue({
        page: pagination.pageIndex,
        take: pagination.pageSize,
        orderBy,
      }),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });

  return {
    unclaimedApplicationsInQueueQuery,
    pagination,
    setPagination,
    sorting,
    setSorting,
  };
};

/**
 * Hook that fetches details for a single application in queue (PENDING_REVIEW, IN_REVIEW)
 * This is the data that is consumed by the ReviewApplicationInQueue component
 * @param applicationNumber application number for the application
 * @returns The specified application from the queue.
 */
export const useApplicationInQueueDetailsQuery = (
  applicationNumber: string,
) => {
  return useQuery({
    queryKey: QUEUE_QUERY_KEYS.DETAIL(applicationNumber),
    queryFn: async () => {
      return getApplicationInQueueDetails(applicationNumber);
    },
    enabled: Boolean(applicationNumber),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
  });
};

export const useClaimApplicationInQueueMutation = () => {
  return useMutation({
    mutationFn: (data: {
      companyId: Nullable<number>;
      applicationId: Nullable<string>;
    }) => {
      const { companyId, applicationId } = data;

      return claimApplicationInQueue(companyId, applicationId);
    },
  });
};

export const useWithdrawApplicationInQueueMutation = () => {
  const { invalidate } = useInvalidateApplicationsInQueue();
  const { setSnackBar } = useContext(SnackBarContext);

  return useMutation({
    mutationFn: (applicationId: string) => {
      return updateApplicationQueueStatus({
        applicationId,
        caseActivityType: CASE_ACTIVITY_TYPES.WITHDRAWN,
      });
    },
    onSuccess: () => {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Withdrawn to Applications in Progress",
        alertType: "info",
      });
      invalidate();
    },
    onError: (err: AxiosError) => err,
  });
};

export const useApproveApplicationInQueueMutation = () => {
  const { invalidate } = useInvalidateApplicationsInQueue();

  return useMutation({
    mutationFn: ({
      applicationId,
      companyId,
    }: {
      applicationId: Nullable<string>;
      companyId: number;
    }) => {
      return updateApplicationQueueStatus({
        applicationId,
        caseActivityType: CASE_ACTIVITY_TYPES.APPROVED,
        companyId,
      });
    },
    onSuccess: () => {
      invalidate();
    },
    onError: (err: AxiosError) => err,
  });
};

export const useRejectApplicationInQueueMutation = () => {
  const { invalidate } = useInvalidateApplicationsInQueue();

  return useMutation({
    mutationFn: ({
      applicationId,
      companyId,
    }: {
      applicationId: Nullable<string>;
      companyId: number;
    }) => {
      return updateApplicationQueueStatus({
        applicationId,
        caseActivityType: CASE_ACTIVITY_TYPES.REJECTED,
        companyId,
      });
    },
    onSuccess: () => {
      invalidate();
    },
    onError: (err: AxiosError) => err,
  });
};

export const useInvalidateApplicationsInQueue = () => {
  const queryClient = useQueryClient();

  return {
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: [QUEUE_QUERY_KEYS_BASE],
      });
    },
  };
};
