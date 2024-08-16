import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";

import "./SpecialAuthorizations.scss";
import { RequiredOrNull } from "../../../../common/types/common";
import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";
import { LOAList } from "../../components/SpecialAuthorizations/LOA/list/LOAList";
import { ExpiredLOAModal } from "../../components/SpecialAuthorizations/LOA/expired/ExpiredLOAModal";
import { DeleteConfirmationDialog } from "../../../../common/components/dialog/DeleteConfirmationDialog";
import { LOASteps } from "./LOA/LOASteps";
import { useFetchLOAs, useRemoveLOAMutation } from "../../hooks/LOA";
import {
  getDefaultNullableVal,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";
import { NoFeePermitType } from "../../types/SpecialAuthorization";
import { NoFeePermitsSection } from "../../components/SpecialAuthorizations/NoFeePermits/NoFeePermitsSection";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { LCVSection } from "../../components/SpecialAuthorizations/LCV/LCVSection";
import { downloadLOA } from "../../apiManager/specialAuthorization";
import {
  canUpdateLCVFlag,
  canUpdateLOA,
  canUpdateNoFeePermitsFlag,
  canViewLCVFlag,
  canViewLOA,
  canViewNoFeePermitsFlag,
} from "../../helpers/permissions";

export const SpecialAuthorizations = ({ companyId }: { companyId: number }) => {
  const [enableNoFeePermits, setEnableNoFeePermits] = useState<boolean>(false);
  const [noFeePermitType, setNoFeePermitType] =
    useState<RequiredOrNull<NoFeePermitType>>(null);
  const [enableLCV, setEnableLCV] = useState<boolean>(false);
  const [showExpiredLOAs, setShowExpiredLOAs] = useState<boolean>(false);
  const [loaToDelete, setLoaToDelete] = useState<RequiredOrNull<string>>(null);
  const [showLOASteps, setShowLOASteps] = useState<boolean>(false);
  const [loaToEdit, setLoaToEdit] = useState<RequiredOrNull<string>>(null);

  const { userRoles, idirUserDetails, userDetails } =
    useContext(OnRouteBCContext);

  const canEditNoFeePermits = canUpdateNoFeePermitsFlag(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userRole, userDetails?.userRole),
  );

  const canViewNoFeePermits = canViewNoFeePermitsFlag(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userRole, userDetails?.userRole),
  );

  const canUpdateLCV = canUpdateLCVFlag(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userRole, userDetails?.userRole),
  );

  const canViewLCV = canViewLCVFlag(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userRole, userDetails?.userRole),
  );

  const canWriteLOA = canUpdateLOA(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userRole, userDetails?.userRole),
  );

  const canReadLOA = canViewLOA(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userRole, userDetails?.userRole),
  );

  const activeLOAsQuery = useFetchLOAs(companyId, false);
  const expiredLOAsQuery = useFetchLOAs(companyId, true);
  const removeLOAMutation = useRemoveLOAMutation();

  const activeLOAs = getDefaultRequiredVal([], activeLOAsQuery.data);
  const expiredLOAs = getDefaultRequiredVal([], expiredLOAsQuery.data);

  useEffect(() => {
    if (!enableNoFeePermits) {
      setNoFeePermitType(null);
    }
  }, [enableNoFeePermits]);

  const handleShowExpiredLOA = () => {
    setShowExpiredLOAs(true);
  };

  const handleAddLOA = () => {
    if (!canWriteLOA) return;
    setShowLOASteps(true);
    setLoaToEdit(null);
  };

  const handleEditLOA = (loaId: string) => {
    if (!canWriteLOA) return;
    setShowLOASteps(true);
    setLoaToEdit(loaId);
  };

  const handleExitLOASteps = () => {
    setShowLOASteps(false);
    setLoaToEdit(null);
    activeLOAsQuery.refetch();
    expiredLOAsQuery.refetch();
  };

  const handleOpenDeleteModal = (loaId: string) => {
    if (!canWriteLOA) return;
    setLoaToDelete(loaId);
  };

  const handleCloseDeleteModal = () => {
    setLoaToDelete(null);
  };

  const handleDeleteLOA = async (loaId: string) => {
    try {
      if (canWriteLOA) {
        await removeLOAMutation.mutateAsync({
          companyId,
          loaId,
        });

        activeLOAsQuery.refetch();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoaToDelete(null);
    }
  };

  const handleDownloadLOA = async (loaId: string) => {
    if (loaId && canReadLOA) {
      try {
        const { blobObj: blobObjWithoutType } = await downloadLOA(
          loaId,
          companyId,
        );

        const objUrl = URL.createObjectURL(
          new Blob([blobObjWithoutType], { type: "application/pdf" }),
        );
        window.open(objUrl, "_blank");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const showExpiredLOAsLink = canReadLOA && expiredLOAs.length > 0;
  const showActiveLOAsList = canReadLOA && activeLOAs.length > 0;
  const showExpiredLOAsModal = canReadLOA && showExpiredLOAs;
  const showDeleteDialog = canWriteLOA && loaToDelete;

  if (showLOASteps) {
    return canWriteLOA ? (
      <LOASteps
        loaId={loaToEdit}
        companyId={companyId}
        onExit={handleExitLOASteps}
      />
    ) : null;
  }

  return (
    <div className="special-authorizations">
      {canViewNoFeePermits ? (
        <NoFeePermitsSection
          enableNoFeePermits={enableNoFeePermits}
          setEnableNoFeePermits={setEnableNoFeePermits}
          noFeePermitType={noFeePermitType}
          setNoFeePermitType={setNoFeePermitType}
          isEditable={canEditNoFeePermits}
        />
      ) : null}

      {canViewLCV ? (
        <LCVSection
          enableLCV={enableLCV}
          setEnableLCV={setEnableLCV}
          isEditable={canUpdateLCV}
        />
      ) : null}

      {canReadLOA ? (
        <div className="special-authorizations__loa">
          <div className="special-authorizations__section-header">
            <div className="special-authorizations__header-title">
              Letter of Authorization (LOA)
            </div>

            {showExpiredLOAsLink ? (
              <CustomActionLink
                className="special-authorizations__link"
                onClick={handleShowExpiredLOA}
              >
                Expired LOA(s)
              </CustomActionLink>
            ) : null}
          </div>

          {canWriteLOA ? (
            <Button
              className="add-loa-btn"
              key="add-loa-button"
              aria-label="Add LOA"
              variant="contained"
              color="tertiary"
              onClick={handleAddLOA}
            >
              <FontAwesomeIcon className="add-loa-btn__icon" icon={faPlus} />
              Add an LOA
            </Button>
          ) : (
            <div className="loa-info">
              Download the letter to see the specific travel terms of the LOA.
            </div>
          )}

          {showActiveLOAsList ? (
            <div className="active-loas">
              <div className="active-loas__header">Active LOA(s)</div>

              <LOAList
                loas={activeLOAs}
                isActive={true}
                allowEditLOA={canWriteLOA}
                onDelete={handleOpenDeleteModal}
                onEdit={handleEditLOA}
                onDownload={handleDownloadLOA}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {showExpiredLOAsModal ? (
        <ExpiredLOAModal
          allowEditLOA={canWriteLOA}
          showModal={showExpiredLOAs}
          handleCancel={() => setShowExpiredLOAs(false)}
          expiredLOAs={expiredLOAs}
          handleEdit={(loaId) => {
            setShowExpiredLOAs(false);
            handleEditLOA(loaId);
          }}
          handleDownload={handleDownloadLOA}
        />
      ) : null}

      {showDeleteDialog ? (
        <DeleteConfirmationDialog
          showDialog={Boolean(loaToDelete)}
          onCancel={handleCloseDeleteModal}
          onDelete={() => handleDeleteLOA(loaToDelete)}
          itemToDelete="item"
          confirmationMsg={"Are you sure you want to delete this?"}
        />
      ) : null}
    </div>
  );
};
