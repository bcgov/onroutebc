import { RowSelectionState } from "@tanstack/table-core";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../../../App";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { NoRecordsFound } from "../../../common/components/table/NoRecordsFound";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../common/helpers/tableHelper";
import {
  getDefaultNullableVal,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";
import { Loading } from "../../../common/pages/Loading";
import { APPLICATION_QUEUE_ROUTES } from "../../../routes/constants";
import { ApplicationListItem } from "../../permits/types/application";
import {
  useApplicationInQueueMetadata,
  useClaimApplicationInQueueMutation,
  useUnclaimedApplicationsInQueueQuery,
} from "../hooks/hooks";
import { getApplicationInQueueColumnDefinition } from "./ApplicationInQueueColumnDefinition";
import { ClaimedApplicationModal } from "./ClaimedApplicationModal";

export const ApplicationsInQueueList = () => {
  const {
    unclaimedApplicationsInQueueQuery,
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useUnclaimedApplicationsInQueueQuery();

  const {
    data: unclaimedApplications,
    isError: unclaimedApplicationsError,
    isPending: unclaimedApplicationsPending,
    isFetching: unclaimedapplicationsFetching,
    refetch: refetchUnclaimedApplications,
  } = unclaimedApplicationsInQueueQuery;

  const [showTable, setShowTable] = useState<boolean>(false);

  useEffect(() => {
    const totalCount = getDefaultRequiredVal(
      0,
      unclaimedApplications?.meta?.totalItems,
    );
    setShowTable(totalCount > 0);
  }, [unclaimedApplications?.meta?.totalItems]);

  const { idirUserDetails, userDetails } = useContext(OnRouteBCContext);
  const userRole = getDefaultNullableVal(
    idirUserDetails?.userRole,
    userDetails?.userRole,
  );

  const snackBar = useContext(SnackBarContext);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (unclaimedApplicationsError) {
      snackBar.setSnackBar({
        message: "An unexpected error occurred.",
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "error",
      });
    }
  }, [unclaimedApplicationsError]);

  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationListItem>();
  const [assignedUser, setAssignedUser] = useState<string>("");
  const [showClaimedApplicationModal, setShowClaimedApplicationModal] =
    useState<boolean>(false);

  const { refetch: refetchApplicationMetadata } = useApplicationInQueueMetadata(
    {
      applicationId: getDefaultRequiredVal("", selectedApplication?.permitId),
      companyId: getDefaultRequiredVal(0, selectedApplication?.companyId),
    },
  );

  const confirmClaimApplication = async (application: ApplicationListItem) => {
    await claimApplication({
      companyId: application.companyId,
      applicationId: application.permitId,
    });
  };

  const handleClaimApplication = async (application: ApplicationListItem) => {
    const { data: applicationMetadata } = await refetchApplicationMetadata();

    if (applicationMetadata?.assignedUser) {
      setAssignedUser(applicationMetadata.assignedUser);
      setShowClaimedApplicationModal(true);
    } else {
      confirmClaimApplication(application);
    }
  };

  const handleFollowApplicationLink = (application: ApplicationListItem) => {
    setSelectedApplication(application);
  };

  useEffect(() => {
    selectedApplication && handleClaimApplication(selectedApplication);
  }, [selectedApplication]);

  const handleCloseClaimedApplicationModal = () => {
    setShowClaimedApplicationModal(false);
    refetchUnclaimedApplications();
  };

  const {
    mutateAsync: claimApplication,
    data: claimApplicationResponse,
    isPending: claimApplicationPending,
  } = useClaimApplicationInQueueMutation();

  const navigate = useNavigate();

  const isSuccess = (status?: number) => status === 201;

  useEffect(() => {
    if (isSuccess(claimApplicationResponse?.status)) {
      navigate(
        APPLICATION_QUEUE_ROUTES.REVIEW(
          selectedApplication?.companyId,
          selectedApplication?.permitId,
        ),
      );
    }
  }, [claimApplicationResponse]);

  const columns = getApplicationInQueueColumnDefinition(
    handleFollowApplicationLink,
  );

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns,
    data: getDefaultRequiredVal([], unclaimedApplications?.items),
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: unclaimedApplicationsError,
      showProgressBars: unclaimedapplicationsFetching,
      columnVisibility: { applicationId: true },
      isLoading: unclaimedApplicationsPending,
      rowSelection,
      pagination,
      sorting,
    },
    layoutMode: "grid",
    displayColumnDefOptions: {
      "mrt-row-select": {
        size: 10,
      },
      "mrt-row-actions": {
        header: "",
        size: 40,
      },
    },
    enableRowActions: true,
    enableRowSelection: false,
    onRowSelectionChange: useCallback(setRowSelection, [userRole]),
    getRowId: (originalRow) => {
      const applicationRow = originalRow as ApplicationListItem;
      return applicationRow.permitId;
    },
    renderTopToolbar: false,
    enableGlobalFilter: false,
    autoResetPageIndex: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: getDefaultRequiredVal(0, unclaimedApplications?.meta?.totalItems),
    pageCount: getDefaultRequiredVal(0, unclaimedApplications?.meta?.pageCount),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    enablePagination: true,
    enableBottomToolbar: true,
    muiToolbarAlertBannerProps: unclaimedApplicationsError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableBodyRowProps: {
      className: "applications-in-queue-list__row",
    },
  });

  if (claimApplicationPending) return <Loading />;

  return (
    <>
      {showTable ? (
        <div>
          <div className="applications-in-queue-list table-container">
            <MaterialReactTable table={table} />
          </div>
        </div>
      ) : (
        <NoRecordsFound />
      )}
      <ClaimedApplicationModal
        showModal={showClaimedApplicationModal}
        onCancel={handleCloseClaimedApplicationModal}
        onConfirm={() =>
          confirmClaimApplication(selectedApplication as ApplicationListItem)
        }
        assignedUser={assignedUser}
      />
    </>
  );
};
