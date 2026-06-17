import { Box, Button } from "@mui/material";

import "./AddCreditAccountAction.scss";
import { useState } from "react";
import { AddCreditAccountModal } from "./AddCreditAccountModal";

export const AddCreditAccountAction = ({
  companyId,
  onConfirm,
}: {
  companyId: number;
  onConfirm?: () => void;
}) => {
  const [showAddCreditAccountModal, setShowAddCreditAccountModal] =
    useState<boolean>(false);

  const handleStartButtonClicked = () => {
    setShowAddCreditAccountModal(true);
  };

  const handleCloseAddCreditAccountModal = () => {
    setShowAddCreditAccountModal(false);
  };

  const confirmAddCreditAccount = () => {
    setShowAddCreditAccountModal(false);
    onConfirm?.();
  };

  return (
    <div>
      <Box className="add-credit-account-action">
        <div className="add-credit-account-action__control">
          <Button
            className="add-credit-account-action__btn"
            variant="contained"
            onClick={handleStartButtonClicked}
          >
            Add Credit Account
          </Button>
        </div>
      </Box>
      {showAddCreditAccountModal ? (
        <AddCreditAccountModal
          showModal={showAddCreditAccountModal}
          onCancel={handleCloseAddCreditAccountModal}
          onConfirm={confirmAddCreditAccount}
          companyId={companyId}
        />
      ) : null}
    </div>
  );
};
