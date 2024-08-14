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
import { getDefaultNullableVal, getDefaultRequiredVal } from "../../../../common/helpers/util";
import { NoFeePermitType } from "../../types/SpecialAuthorization";
import { NoFeePermitsSection } from "../../components/SpecialAuthorizations/NoFeePermits/NoFeePermitsSection";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { LCVSection } from "../../components/SpecialAuthorizations/LCV/LCVSection";
import { downloadLOA } from "../../apiManager/specialAuthorization";
import { useFetchSpecialAuthorizations, useUpdateLCV, useUpdateNoFee } from "../../hooks/specialAuthorizations";
import {
  canUpdateLCVFlag,
  canUpdateLOA,
  canUpdateNoFeePermitsFlag,
  canViewLCVFlag,
  canViewLOA,
  canViewNoFeePermitsFlag,
} from "../../helpers/permissions";

export const SpecialAuthorizations = ({
  companyId,
}: {
  companyId: number;
}) => {
  const {
    data: specialAuthorizations,
    refetch: refetchSpecialAuth,
  } = useFetchSpecialAuthorizations(companyId);

  const noFeeType = getDefaultRequiredVal(null, specialAuthorizations?.noFeeType);
  const isLcvAllowed = getDefaultRequiredVal(false, specialAuthorizations?.isLcvAllowed);

  // No-Fee switch state
  const [enableNoFeePermits, setEnableNoFeePermits] = useState<boolean>(Boolean(noFeeType));

  const [showExpiredLOAs, setShowExpiredLOAs] = useState<boolean>(false);
  const [loaToDelete, setLoaToDelete] = useState<RequiredOrNull<string>>(null);
  const [showLOASteps, setShowLOASteps] = useState<boolean>(false);
  const [loaToEdit, setLoaToEdit] = useState<RequiredOrNull<string>>(null);

  const {
    userRoles,
    idirUserDetails,
    userDetails,
  } = useContext(OnRouteBCContext);

  const canEditNoFeePermits = canUpdateNoFeePermitsFlag(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userAuthGroup, userDetails?.userAuthGroup),
  );

  const canViewNoFeePermits = canViewNoFeePermitsFlag(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userAuthGroup, userDetails?.userAuthGroup),
  );

  const canUpdateLCV = canUpdateLCVFlag(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userAuthGroup, userDetails?.userAuthGroup),
  );

  const canViewLCV = canViewLCVFlag(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userAuthGroup, userDetails?.userAuthGroup),
  );

  const canWriteLOA = canUpdateLOA(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userAuthGroup, userDetails?.userAuthGroup),
  );

  const canReadLOA = canViewLOA(
    userRoles,
    getDefaultNullableVal(idirUserDetails?.userAuthGroup, userDetails?.userAuthGroup),
  );

  const updateNoFeeMutation = useUpdateNoFee();
  const updateLCVMutation = useUpdateLCV();

  const activeLOAsQuery = useFetchLOAs(companyId, false);
  const expiredLOAsQuery = useFetchLOAs(companyId, true);
  const removeLOAMutation = useRemoveLOAMutation();

  const activeLOAs = getDefaultRequiredVal([], activeLOAsQuery.data);
  const expiredLOAs = getDefaultRequiredVal([], expiredLOAsQuery.data);

  useEffect(() => {
    setEnableNoFeePermits(Boolean(noFeeType));
  }, [noFeeType]);

  const handleToggleEnableNoFee = async (enable: boolean) => {
    if (!canEditNoFeePermits) return;
    if (enable) {
      setEnableNoFeePermits(enable);
    } else {
      const { status } = await updateNoFeeMutation.mutateAsync({
        companyId,
        noFee: null,
      });
  
      if (status === 200 || status === 201) {
        refetchSpecialAuth();
      }
    }
  };

  const handleUpdateNoFee = async (noFee: RequiredOrNull<NoFeePermitType>) => {
    if (!canEditNoFeePermits) return;
    const { status } = await updateNoFeeMutation.mutateAsync({
      companyId,
      noFee,
    });

    if (status === 200 || status === 201) {
      refetchSpecialAuth();
    }
  };

  const handleUpdateLCV = async (enableLCV: boolean) => {
    if (!canUpdateLCV) return;
    const { status } = await updateLCVMutation.mutateAsync({
      companyId,
      isLcvAllowed: enableLCV,
    });

    if (status === 200 || status === 201) {
      refetchSpecialAuth();
    }
  };

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

  const showExpiredLOAsLink = canReadLOA && (expiredLOAs.length > 0);
  const showActiveLOAsList = canReadLOA && (activeLOAs.length > 0);
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
          onUpdateEnableNoFee={handleToggleEnableNoFee}
          noFeePermitType={noFeeType}
          onUpdateNoFee={handleUpdateNoFee}
          isEditable={canEditNoFeePermits}
        />
      ) : null}

      {canViewLCV ? (
        <LCVSection
          enableLCV={isLcvAllowed}
          onUpdateLCV={handleUpdateLCV}
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
              <FontAwesomeIcon
                className="add-loa-btn__icon"
                icon={faPlus}
              />
              Add an LOA
            </Button>
          ) : (
            <div className="loa-info">
              Download the letter to see the specific travel terms of the LOA.
            </div>
          )}

          {showActiveLOAsList ? (
            <div className="active-loas">
              <div className="active-loas__header">
                Active LOA(s)
              </div>

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
