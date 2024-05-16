import { Button, FormControlLabel, Radio, RadioGroup, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "./SpecialAuthorizations.scss";
import { RequiredOrNull } from "../../../../common/types/common";
import { NO_FEE_PERMIT_TYPES, NoFeePermitType, noFeePermitTypeDescription } from "../../types/SpecialAuthorization";
import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";
import { LOAList } from "../../components/SpecialAuthorizations/LOA/list/LOAList";
import { ExpiredLOAModal } from "../../components/SpecialAuthorizations/LOA/expired/ExpiredLOAModal";

export const SpecialAuthorizations = ({
  companyId,
}: {
  companyId: number;
}) => {
  const [enableNoFeePermits, setEnableNoFeePermits] = useState<boolean>(false);
  const [noFeePermitType, setNoFeePermitType] = useState<RequiredOrNull<NoFeePermitType>>(null);
  const [enableLCV, setEnableLCV] = useState<boolean>(false);
  const [showExpiredLOAs, setShowExpiredLOAs] = useState<boolean>(false);

  useEffect(() => {
    if (!enableNoFeePermits) {
      setNoFeePermitType(null);
    }
  }, [enableNoFeePermits]);

  const handleShowExpiredLOA = () => {
    setShowExpiredLOAs(true);
  };

  const handleAddLOA = () => {
    console.log("Open Add LOA Page"); //
  };

  const activeLOAs = [
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100425",
      startDate: "2023-02-10 00:00:00",
      documentId: 2,
    },
  ];

  const expiredLOAs = [
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    //
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
    {
      loaNumber: "100638",
      startDate: "2023-02-10 00:00:00",
      expiryDate: "2023-02-10 00:00:00",
      documentId: 1,
    },
  ];

  return (
    <div className="special-authorizations">
      <div className="special-authorizations__no-fee">
        <div className="special-authorizations__section-header">
          <div className="special-authorizations__header-title">
            No Fee Permits
          </div>

          <Switch
            className="special-authorizations__enable-switch"
            checked={enableNoFeePermits}
            onChange={async (_, checked) => setEnableNoFeePermits(checked)}
          />
        </div>

        <div className="no-fee-options">
          <div className="no-fee-options__title">
            Permits are required, but no fee is charged for a vehicle owned or leased or operated by:
          </div>

          <RadioGroup
            className="no-fee-options__types"
            defaultValue={noFeePermitType}
            value={noFeePermitType}
            onChange={(e) => setNoFeePermitType(Number(e.target.value) as NoFeePermitType)}
          >
            {Object.values(NO_FEE_PERMIT_TYPES).map((noFeePermitType) => (
              <FormControlLabel
                key={noFeePermitType}
                className={`no-fee-options__type`}
                disabled={!enableNoFeePermits}
                classes={{
                  label: "no-fee-options__label",
                  disabled: "no-fee-options__type--disabled",
                }}
                label={noFeePermitTypeDescription(noFeePermitType)}
                value={noFeePermitType}
                control={
                  <Radio
                    key={noFeePermitType}
                    className="no-fee-options__radio"
                  />}
              />
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="special-authorizations__lcv">
        <div className="special-authorizations__section-header">
          <div className="special-authorizations__header-title">
            Long Combination Vehicle (LCV)
          </div>

          <Switch
            className="special-authorizations__enable-switch"
            checked={enableLCV}
            onChange={async (_, checked) => setEnableLCV(checked)}
          />
        </div>

        <div className="lcv-info">
          Carrier meets the requirements to operate LCVs in BC.
        </div>
      </div>

      <div className="special-authorizations__loa">
        <div className="special-authorizations__section-header">
          <div className="special-authorizations__header-title">
            Letter of Authorization (LOA)
          </div>

          <CustomActionLink
            className="special-authorizations__link"
            onClick={handleShowExpiredLOA}
          >
            Expired LOA(s)
          </CustomActionLink>
        </div>

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

        {activeLOAs.length > 0 ? (
          <div className="active-loas">
            <div className="active-loas__header">
              Active LOA(s)
            </div>

            <LOAList loas={activeLOAs} isActive={true} />
          </div>
        ) : null}

        {showExpiredLOAs ? (
          <ExpiredLOAModal
            showModal={showExpiredLOAs}
            handleCancel={() => setShowExpiredLOAs(false)}
            expiredLOAs={expiredLOAs}
          />
        ) : null}
      </div>

      {companyId}
    </div>
  );
};
