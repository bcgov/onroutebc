import { Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FormProvider, useForm } from "react-hook-form";
import {
  useAddCreditAccountUserMutation,
  useGetCreditAccountQuery,
} from "../../hooks/creditAccount";
import {
  CREDIT_ACCOUNT_USER_TYPE,
  CreditAccountUser,
} from "../../types/creditAccount";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { StatusChip } from "./StatusChip";
import "./AddUserModal.scss";
import { useContext } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

export const AddUserModal = ({
  showModal,
  onCancel,
  onConfirm,
  userData,
}: {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  userData: CompanyProfile;
}) => {
  const { companyId } = useContext(OnRouteBCContext);

  const formMethods = useForm<{ comment: string }>({
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };

  const { data: creditAccount } = useGetCreditAccountQuery(
    getDefaultRequiredVal(0, companyId),
  );
  const { data: userCreditAccount } = useGetCreditAccountQuery(
    userData.companyId,
  );

  const existingCreditAccountHolder =
    userCreditAccount?.creditAccountUsers?.find(
      (user: CreditAccountUser) =>
        user.userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER,
    );

  const { mutateAsync, isPending } = useAddCreditAccountUserMutation();

  const handleAddUser = async () => {
    if (creditAccount?.creditAccountId) {
      try {
        const { status } = await mutateAsync({
          companyId: getDefaultRequiredVal(0, companyId),
          creditAccountId: creditAccount.creditAccountId,
          userData,
        });

        if (isActionSuccessful(status)) {
          onConfirm();
        }
      } catch (error) {
        return;
      }
    }
  };

  const showConfirmButton = !userCreditAccount && !userData.isSuspended;

  return (
    <Dialog
      className="add-user-modal"
      open={showModal}
      onClose={onCancel}
      PaperProps={{
        className: "add-user-modal__container",
      }}
    >
      <div className="add-user-modal__header">
        <div className="add-user-modal__icon">
          <FontAwesomeIcon className="icon" icon={faPlusCircle} />
        </div>

        <h2 className="add-user-modal__title">Add Credit Account User</h2>
      </div>

      <FormProvider {...formMethods}>
        <div className="add-user-modal__body">
          <dl>
            <div className="add-user-modal__item">
              <dt className="add-user-modal__key">Company Name</dt>
              <dd className="add-user-modal__value">
                {userData.legalName}{" "}
                <span className="add-user-modal__suspend-chip">
                  {userData.isSuspended && <StatusChip status="SUSPENDED" />}
                </span>
              </dd>
            </div>
            {userData.alternateName ? (
              <div className="add-user-modal__item">
                <dt className="add-user-modal__key">Doing Buisness As (DBA)</dt>
                <dd className="add-user-modal__value">
                  {userData.alternateName}
                </dd>
              </div>
            ) : null}
            <div className="add-user-modal__item">
              <dt className="add-user-modal__key">OnRouteBC Client No.</dt>
              <dd className="add-user-modal__value">{userData.clientNumber}</dd>
            </div>
          </dl>
          {existingCreditAccountHolder && (
            <div className="add-user-modal__info info">
              <div className="info__header">
                <div className="info__icon">
                  <FontAwesomeIcon className="icon" icon={faInfoCircle} />
                </div>
                <h3 className="info__title">
                  This company already is a holder or user of
                </h3>
              </div>
              <div className="info__body">
                <div className="add-user-modal__item">
                  <dt className="add-user-modal__key">Company Name</dt>
                  <dt className="add-user-modal__value">
                    {existingCreditAccountHolder.legalName}
                  </dt>
                </div>
                <div className="add-user-modal__item">
                  <dt className="add-user-modal__key">onRouteBC</dt>
                  <dt className="add-user-modal__value">
                    {existingCreditAccountHolder.clientNumber}
                  </dt>
                </div>
                <div className="add-user-modal__item">
                  <dt className="add-user-modal__key">Credit Account No.</dt>
                  <dt className="add-user-modal__value">
                    {userCreditAccount?.creditAccountNumber}
                  </dt>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="add-user-modal__footer">
          <Button
            key="cancel-add-user-button"
            aria-label="Cancel"
            variant="contained"
            color="tertiary"
            className="add-user-button add-user-button--cancel"
            onClick={onCancel}
            data-testid="cancel-add-user-button"
          >
            Cancel
          </Button>

          {showConfirmButton && (
            <Button
              key="add-user-button"
              onClick={handleSubmit(handleAddUser)}
              className="add-user-button add-user-button--confirm"
              data-testid="add-user-button"
              disabled={isPending}
            >
              Add Account User
            </Button>
          )}
        </div>
      </FormProvider>
    </Dialog>
  );
};
