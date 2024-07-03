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
import { useFetchLOAs } from "../../hooks/LOA";
import { getDefaultNullableVal, getDefaultRequiredVal } from "../../../../common/helpers/util";
import { NoFeePermitType } from "../../types/SpecialAuthorization";
import { NoFeePermitsSection } from "../../components/SpecialAuthorizations/NoFeePermits/NoFeePermitsSection";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { LCVSection } from "../../components/SpecialAuthorizations/LCV/LCVSection";
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
  const [enableNoFeePermits, setEnableNoFeePermits] = useState<boolean>(false);
  const [noFeePermitType, setNoFeePermitType]
    = useState<RequiredOrNull<NoFeePermitType>>(null);
  const [enableLCV, setEnableLCV] = useState<boolean>(false);
  const [showExpiredLOAs, setShowExpiredLOAs] = useState<boolean>(false);
  const [LOAToDelete, setLOAToDelete] = useState<RequiredOrNull<string>>(null);
  const [showLOASteps, setShowLOASteps] = useState<boolean>(false);
  const [LOAToEdit, setLOAToEdit] = useState<RequiredOrNull<string>>(null);

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

  const activeLOAsQuery = useFetchLOAs(companyId, false);
  const expiredLOAsQuery = useFetchLOAs(companyId, true);

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
    setLOAToEdit(null);
  };

  const handleEditLOA = (loaNumber: string) => {
    if (!canWriteLOA) return;
    setShowLOASteps(true);
    setLOAToEdit(loaNumber);
  };

  const handleExitLOASteps = () => {
    setShowLOASteps(false);
    setLOAToEdit(null);
  };

  const handleOpenDeleteModal = (loaNumber: string) => {
    if (!canWriteLOA) return;
    setLOAToDelete(loaNumber);
  };

  const handleCloseDeleteModal = () => {
    setLOAToDelete(null);
  };

  const handleDeleteLOA = (loaNumber: string) => {
    if (canWriteLOA) {
      console.log(`Deleting LOA ${loaNumber}...`); //
    }
    
    setLOAToDelete(null);
  };
  
  return !showLOASteps ? (
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

            {canReadLOA && (expiredLOAs.length > 0) ? (
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

          {canReadLOA && (activeLOAs.length > 0) ? (
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
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {canReadLOA && showExpiredLOAs ? (
        <ExpiredLOAModal
          allowEditLOA={canWriteLOA}
          showModal={showExpiredLOAs}
          handleCancel={() => setShowExpiredLOAs(false)}
          expiredLOAs={expiredLOAs}
          handleEdit={(loaNumber) => {
            setShowExpiredLOAs(false);
            handleEditLOA(loaNumber);
          }}
        />
      ) : null}

      {canWriteLOA && LOAToDelete ? (
        <DeleteConfirmationDialog
          showDialog={Boolean(LOAToDelete)}
          onCancel={handleCloseDeleteModal}
          onDelete={() => handleDeleteLOA(LOAToDelete)}
          itemToDelete="item"
          confirmationMsg={"Are you sure you want to delete this?"}
        />
      ) : null}
    </div>
  ) : canWriteLOA ? (
    <LOASteps
      loaNumber={LOAToEdit}
      companyId={companyId}
      onExit={handleExitLOASteps}
    />
  ) : null;
};
