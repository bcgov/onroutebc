import { useEffect, useState } from "react";
import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import { ApplicationInReviewModal } from "./ApplicationInReviewModal";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../../routes/constants";
import {
  useInvalidateApplicationsInQueue,
  useWithdrawApplicationInQueueMutation,
} from "../../../queue/hooks/hooks";

const PERMIT_ACTION_OPTION_TYPES = {
  WITHDRAW_APPLICATION: "withdrawApplication",
} as const;

type PermitActionOptionType =
  (typeof PERMIT_ACTION_OPTION_TYPES)[keyof typeof PERMIT_ACTION_OPTION_TYPES];

const getOptionLabel = (optionType: PermitActionOptionType): string => {
  if (optionType === PERMIT_ACTION_OPTION_TYPES.WITHDRAW_APPLICATION) {
    return "Withdraw Application";
  }

  return "";
};

const ALL_OPTIONS = [
  {
    label: getOptionLabel(PERMIT_ACTION_OPTION_TYPES.WITHDRAW_APPLICATION),
    value: PERMIT_ACTION_OPTION_TYPES.WITHDRAW_APPLICATION,
  },
];

const getOptions = (isInReview: boolean) => {
  return ALL_OPTIONS.filter((option) => {
    // Exclude 'WITHDRAW_APPLICATION' if 'isInReview' is false
    if (
      isInReview &&
      option.value === PERMIT_ACTION_OPTION_TYPES.WITHDRAW_APPLICATION
    ) {
      return false;
    }
    return true;
  });
};

export const ApplicationsInReviewRowOptions = ({
  isInReview,
  permitId,
}: {
  isInReview: boolean;
  permitId: string;
}) => {
  const navigate = useNavigate();
  const { invalidate } = useInvalidateApplicationsInQueue();

  const [isAIRModalOpen, setIsAIRModalOpen] = useState<boolean>(false);

  const handleCloseAIRModal = () => {
    setIsAIRModalOpen(false);
    invalidate();
  };

  const {
    mutateAsync: withdrawApplication,
    isError: isWithdrawApplicationError,
    error: withdrawApplicationError,
  } = useWithdrawApplicationInQueueMutation();

  useEffect(() => {
    if (isWithdrawApplicationError) {
      // if the application has already been withdrawn by another user
      if (withdrawApplicationError.response?.status === 422) {
        return setIsAIRModalOpen(true);
      }
      // handle all other errors
      navigate(ERROR_ROUTES.UNEXPECTED);
    }
  }, [isWithdrawApplicationError, withdrawApplicationError]);

  /**
   * Action handler upon a select event.
   * @param selectedOption The option that was selected.
   */
  const onSelectOptionCallback = async (selectedOption: string) => {
    if (selectedOption === PERMIT_ACTION_OPTION_TYPES.WITHDRAW_APPLICATION) {
      await withdrawApplication(permitId);
    }
  };

  return (
    <>
      <OnRouteBCTableRowActions
        onSelectOption={onSelectOptionCallback}
        options={getOptions(isInReview)}
      />

      <ApplicationInReviewModal
        isOpen={isAIRModalOpen}
        onCancel={handleCloseAIRModal}
        onConfirm={handleCloseAIRModal}
      />
    </>
  );
};
