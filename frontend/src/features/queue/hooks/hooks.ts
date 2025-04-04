import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MRT_PaginationState, MRT_SortingState } from "material-react-table";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CaseActivityType } from "../types/CaseActivityType";
import { ERROR_ROUTES } from "../../../routes/constants";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { Nullable } from "../../../common/types/common";
import { useTableControls } from "../../permits/hooks/useTableControls";
import {
  APPLICATION_QUEUE_STATUSES,
  ApplicationQueueStatus,
} from "../types/ApplicationQueueStatus";
import {
  claimApplicationInQueue,
  getApplicationInQueueMetadata,
  getApplicationsInQueue,
  getClaimedApplicationsInQueue,
  getUnclaimedApplicationsInQueue,
  submitApplicationForReview,
  updateApplicationQueueStatus,
} from "../apiManager/queueAPI";
import { usePermissionMatrix } from "../../../common/authentication/PermissionMatrix";

const QUEUE_QUERY_KEYS_BASE = "queue";

/*
 * The queryKey structure is: ["queue", status?, { pagination, sorting }]
 *
 * eg. ["queue"] and ["queue", undefined] refers to all (ApplicationQueueStatus) queue items
 * (regardless of pagination and sorting)
 *
 * eg. ["queue", "IN_REVIEW"] only refers to "IN_REVIEW" queue items
 */
const QUEUE_QUERY_KEYS = {
  ALL_ITEMS: [QUEUE_QUERY_KEYS_BASE] as const,
  WITH_STATUS: (status?: ApplicationQueueStatus) =>
    [...QUEUE_QUERY_KEYS.ALL_ITEMS, status] as const,
  WITH_PAGINATION: (
    pagination: MRT_PaginationState,
    sorting: MRT_SortingState,
    status?: ApplicationQueueStatus,
  ) =>
    [...QUEUE_QUERY_KEYS.WITH_STATUS(status), { pagination, sorting }] as const,
  APPLICATION_METADATA: (applicationId: string) => [
    QUEUE_QUERY_KEYS_BASE,
    { applicationId },
  ],
};

/**
 * Hook that fetches all applications in queue (PENDING_REVIEW and IN_REVIEW) for staff and manages its pagination state.
 * This is the data that is consumed by the ApplicationsInReviewList component.
 * @returns All applications in queue (PENDING_REVIEW and IN_REVIEW) along with pagination state and setter
 */
export const useApplicationsInQueueQuery = () => {
  const { companyId } = useContext(OnRouteBCContext);

  const canViewApplicationQueue = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "STAFF_HOME_SCREEN",
      permissionMatrixFunctionKey: "VIEW_QUEUE",
    },
  });

  // if typeof company === "undefined" here we know that the staff user is NOT acting as a company
  const getStaffQueue =
    canViewApplicationQueue && typeof companyId === "undefined";

  const { pagination, setPagination, sorting, setSorting, orderBy } =
    useTableControls();

  const applicationsInQueueQuery = useQuery({
    queryKey: QUEUE_QUERY_KEYS.WITH_PAGINATION(pagination, sorting),
    queryFn: () =>
      getApplicationsInQueue(
        {
          page: pagination.pageIndex,
          take: pagination.pageSize,
          orderBy,
        },
        getStaffQueue,
        companyId,
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
    queryKey: QUEUE_QUERY_KEYS.WITH_PAGINATION(
      pagination,
      sorting,
      APPLICATION_QUEUE_STATUSES.IN_REVIEW,
    ),
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
    queryKey: QUEUE_QUERY_KEYS.WITH_PAGINATION(
      pagination,
      sorting,
      APPLICATION_QUEUE_STATUSES.PENDING_REVIEW,
    ),
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

export const useUpdateApplicationInQueueStatus = () => {
  const { invalidate } = useInvalidateApplicationsInQueue();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: {
      applicationId: string;
      caseActivityType: CaseActivityType;
      companyId?: number;
      comment?: string;
    }) => {
      return updateApplicationQueueStatus(data);
    },
    onSuccess: () => {
      invalidate();
    },
    onError: (err: any) => {
      if (err.response?.status === 422) {
        // console.log({ err });
        return err;
      } else {
        navigate(ERROR_ROUTES.UNEXPECTED, {
          state: { correlationId: err.response?.headers["x-correlation-id"] },
        });
      }
    },
  });
};

/**
 * Hook for submitting an application for review by adding it to the queue.
 * @returns Mutation object that allows the application to be submitted for review
 */
export const useSubmitApplicationForReview = () => {
  const { invalidate } = useInvalidateApplicationsInQueue();

  return useMutation({
    mutationFn: async (data: { companyId: number; applicationId: string }) => {
      return submitApplicationForReview(data.companyId, data.applicationId);
    },
    onSuccess: () => {
      invalidate();
    },
  });
};

/**
 * Hook that allows all queue query keys to be invalidated.
 * @returns Method that invalidates the query keys
 */
export const useInvalidateApplicationsInQueue = () => {
  const queryClient = useQueryClient();

  return {
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: QUEUE_QUERY_KEYS.ALL_ITEMS,
      });
    },
  };
};

/**
 * Hook that fetches additional information for a given applicationId.
 * @returns Application Metadata including the "assignedUser" property used by the queue feature
 */
export const useApplicationInQueueMetadata = ({
  companyId,
  applicationId,
}: {
  companyId: number;
  applicationId: string;
}) => {
  const { idirUserDetails } = useContext(OnRouteBCContext);
  return useQuery({
    queryKey: QUEUE_QUERY_KEYS.APPLICATION_METADATA(applicationId),
    queryFn: () => getApplicationInQueueMetadata(companyId, applicationId),
    // enable fetching only when applicationId is defined and user is IDIR user
    enabled: Boolean(companyId && applicationId && idirUserDetails),
    staleTime: 0,
  });
};
