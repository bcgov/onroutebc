import { Box, Button, Checkbox, Dialog } from "@mui/material";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import "./AddCreditAccountModal.scss";
import { WarningBcGovBanner } from "../../../../common/components/banners/WarningBcGovBanner";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import {
  creditAccounteGARMSError,
  creditAccountNumberAlreadyAssigned,
  creditAccountNumberNotFound,
  requiredMessage,
} from "../../../../common/helpers/validationMessages";
import { ORBC_FORM_FEATURES } from "../../../../common/types/common";
import { useCompanyInfoDetailsQuery } from "../../../manageProfile/apiManager/hooks";
import { useEffect, useState } from "react";
import {
  useCreateCreditAccountMutation,
  useGetCreditAccountDetailsEgarmsQuery,
} from "../../hooks/creditAccount";
import {
  EGARMS_CODE_ERROR_MESSAGES,
  EGARMS_ERROR_CODE,
  EGARMS_SUCCESS_CODE,
} from "../../types/creditAccount";
import {
  getEGARMSErrorMessage,
  renderValue,
} from "../../helpers/creditAccount";

export const AddCreditAccountModal = ({
  showModal,
  onCancel,
  onConfirm,
  companyId,
}: {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  companyId: number;
}) => {
  const formMethods = useForm<{ creditAccountNumber: string }>({
    reValidateMode: "onChange",
    defaultValues: { creditAccountNumber: "" },
  });

  const isActionSuccessful = (status: number) => {
    return status === 201;
  };

  const [creditAccountNumber, setCreditAccountNumber] = useState<string>("");

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const [showCreditAccountDetails, setShowCreditAccountDetails] =
    useState<boolean>(false);

  const {
    data: creditAccountDetails,
    isPending: isCreditAccountDetailsPending,
    isError: isCreditAccountDetailsError,
  } = useGetCreditAccountDetailsEgarmsQuery(
    { creditAccountNumber },
    Boolean(creditAccountNumber),
  );

  const { data: companyInfo } = useCompanyInfoDetailsQuery(companyId);

  const { mutateAsync, isPending } = useCreateCreditAccountMutation();

  const { handleSubmit, reset, setError } = formMethods;

  useEffect(() => {
    if (isCreditAccountDetailsError) {
      setError("creditAccountNumber", {
        type: "manual",
        message: EGARMS_CODE_ERROR_MESSAGES.DEFAULT,
      });
    } else if (!isCreditAccountDetailsPending && creditAccountDetails) {
      const eGARMSReturnCode =
        creditAccountDetails?.creditAccountLimits?.egarmsReturnCode;
      if (creditAccountDetails?.isExistingInORBC) {
        setError("creditAccountNumber", {
          type: "manual",
          message: creditAccountNumberAlreadyAssigned(),
        });
      } else if (eGARMSReturnCode === EGARMS_ERROR_CODE.E0001) {
        setError("creditAccountNumber", {
          type: "manual",
          message: creditAccountNumberNotFound(),
        });
      } else if (
        eGARMSReturnCode === EGARMS_SUCCESS_CODE.I0001 ||
        eGARMSReturnCode === EGARMS_ERROR_CODE.E0003 ||
        eGARMSReturnCode === EGARMS_ERROR_CODE.E0004 ||
        eGARMSReturnCode === EGARMS_ERROR_CODE.E1739
      ) {
        setShowCreditAccountDetails(true);
      } else if (eGARMSReturnCode) {
        const eGARMSErrorMessage = getEGARMSErrorMessage(eGARMSReturnCode);
        setError("creditAccountNumber", {
          type: "manual",
          message: creditAccounteGARMSError(
            eGARMSReturnCode,
            eGARMSErrorMessage,
          ),
        });
      }
    }
  }, [creditAccountDetails, isCreditAccountDetailsError]);

  const handleAddCreditAccount = async () => {
    if (creditAccountNumber) {
      const { status } = await mutateAsync({
        companyId,
        creditAccountNumber,
      });

      if (isActionSuccessful(status)) {
        onConfirm();
      } else {
        console.error(`${status}: Failed to add credit account user.`);
      }
    }
  };

  const onNext = async (data: FieldValues) => {
    setCreditAccountNumber(data.creditAccountNumber);
  };

  const onPrevious = async () => {
    setIsConfirmed(false);
    setShowCreditAccountDetails(false);
    setCreditAccountNumber("");
    reset();
  };

  const onConfirmationToggle = async () => {
    setIsConfirmed((previous) => !previous);
  };

  return (
    <Dialog
      className="add-credit-account-modal"
      open={showModal}
      onClose={onCancel}
      PaperProps={{
        className: "add-credit-account-modal__container",
      }}
    >
      <div className="add-credit-account-modal__header">
        <h2 className="add-credit-account-modal__title">Add Credit Account</h2>
      </div>

      <FormProvider {...formMethods}>
        <div className="add-credit-account-modal__body">
          <Box className="add-credit-account-modal__verify-details__container">
            <div className="add-credit-account-modal__verify-details__banner">
              <WarningBcGovBanner
                msg={BANNER_MESSAGES.CREDIT_ACCOUNT_VERIFY_CLIENT_DETAILS}
              />
            </div>
            <div className="add-credit-account-modal__verify-details__info">
              <span>
                Verify the details below to make this client a Credit Account
                Holder.
              </span>
            </div>
          </Box>
          <dl>
            <div className="add-credit-account-modal__item">
              <dt className="add-credit-account-modal__key">Client Name</dt>
              <dd className="add-credit-account-modal__value">
                {companyInfo?.legalName}
              </dd>
            </div>
            {companyInfo?.alternateName ? (
              <div className="add-credit-account-modal__item">
                <dt className="add-credit-account-modal__key">
                  Doing Business As (DBA)
                </dt>
                <dd className="add-credit-account-modal__value">
                  {companyInfo?.alternateName}
                </dd>
              </div>
            ) : null}
            <div className="add-credit-account-modal__item">
              <dt className="add-credit-account-modal__key">
                OnRouteBC Client No.
              </dt>
              <dd className="add-credit-account-modal__value">
                {companyInfo?.clientNumber}
              </dd>
            </div>
            {!showCreditAccountDetails && (
              <div className="add-credit-account-modal__item">
                <CustomFormComponent
                  className="add-credit-account-modal__input"
                  type="input"
                  feature={ORBC_FORM_FEATURES.ADD_CREDIT_ACCOUNT}
                  options={{
                    name: "creditAccountNumber",
                    rules: {
                      required: {
                        value: true,
                        message: requiredMessage(),
                      },
                    },
                    label: "Enter WS No.",
                  }}
                ></CustomFormComponent>
              </div>
            )}
            {showCreditAccountDetails && (
              <>
                <div className="add-credit-account-modal__item">
                  <div className="add-credit-account-modal__details__info">
                    <span>Credit Account Details: {creditAccountNumber}</span>
                  </div>
                  <div className="add-credit-account-modal__details-row">
                    <div className="add-credit-account-modal__details-row__item">
                      <div className="add-credit-account-modal__key">
                        Credit Limit
                      </div>
                      <div className="add-credit-account-modal__value">
                        {renderValue(
                          creditAccountDetails?.creditAccountLimits
                            ?.creditLimit ?? "",
                        )}
                      </div>
                    </div>
                    <div className="add-credit-account-modal__details-row__item">
                      <div className="add-credit-account-modal__key">
                        Current Balance
                      </div>
                      <div className="add-credit-account-modal__value">
                        {renderValue(
                          creditAccountDetails?.creditAccountLimits
                            ?.creditBalance ?? "",
                        )}
                      </div>
                    </div>
                    <div className="add-credit-account-modal__details-row__item">
                      <div className="add-credit-account-modal__key">
                        Available Credit
                      </div>
                      <div className="add-credit-account-modal__value">
                        {renderValue(
                          creditAccountDetails?.creditAccountLimits
                            ?.availableCredit ?? "",
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="add-credit-account-modal__confirmation-container">
                  <Checkbox
                    className="add-credit-account-modal__confirmation-container__checkbox"
                    checked={isConfirmed}
                    onChange={() => onConfirmationToggle()}
                  />
                  I verify that the above information is correct and this client
                  will be the Credit Account Holder.
                </div>
              </>
            )}
          </dl>
        </div>

        <div className="add-credit-account-modal__footer">
          <Button
            key="add-credit-account-button-cancel"
            aria-label="Cancel"
            variant="contained"
            color="tertiary"
            className="add-credit-account-button add-credit-account-button--cancel"
            onClick={onCancel}
            data-testid="add-credit-account-button-cancel"
          >
            Close
          </Button>

          {!showCreditAccountDetails && (
            <Button
              key="add-credit-account-button-next"
              aria-label="Next"
              variant="contained"
              color="tertiary"
              className="add-credit-account-button add-credit-account-button--next"
              onClick={handleSubmit(onNext)}
              data-testid="add-credit-account-button-next"
              disabled={
                Boolean(creditAccountNumber) && isCreditAccountDetailsPending
              }
            >
              Next
            </Button>
          )}
          {showCreditAccountDetails && (
            <>
              <Button
                key="add-credit-account-button-previous"
                aria-label="Previous"
                variant="contained"
                color="tertiary"
                className="add-credit-account-button add-credit-account-button--previous"
                onClick={handleSubmit(onPrevious)}
                disabled={isPending}
                data-testid="add-credit-account-button-previous"
              >
                Previous
              </Button>
              <Button
                key="add-credit-account-button"
                onClick={handleSubmit(handleAddCreditAccount)}
                className="add-credit-account-button add-credit-account-button--confirm"
                data-testid="add-credit-account-button"
                disabled={!isConfirmed || isPending}
              >
                Add Credit Account
              </Button>
            </>
          )}
        </div>
      </FormProvider>
    </Dialog>
  );
};
