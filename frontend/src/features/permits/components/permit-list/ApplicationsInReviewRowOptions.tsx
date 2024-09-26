import { useEffect, useState } from "react";
import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import {
  useWithdrawApplicationInQueueMutation,
  useInvalidateApplicationsInQueue,
} from "../../hooks/hooks";
import { ApplicationInReviewModal } from "./ApplicationInReviewModal";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../../routes/constants";

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

  const { mutateAsync, isError, error } =
    useWithdrawApplicationInQueueMutation();

  useEffect(() => {
    if (isError) {
      // if the application has already been withdrawn by another user
      if (error.response?.status === 422) {
        return setIsAIRModalOpen(true);
      }
      // handle all other errors
      navigate(ERROR_ROUTES.UNEXPECTED);
    }
  }, [isError, error]);

  /**
   * Action handler upon a select event.
   * @param selectedOption The option that was selected.
   */
  const onSelectOptionCallback = (selectedOption: string) => {
    if (selectedOption === PERMIT_ACTION_OPTION_TYPES.WITHDRAW_APPLICATION) {
      mutateAsync(permitId);
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
