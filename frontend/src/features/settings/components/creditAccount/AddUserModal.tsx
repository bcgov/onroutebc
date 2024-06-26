import { Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FormProvider, useForm } from "react-hook-form";
import {
  useAddCreditAccountUserMutation,
  useGetCreditAccountQuery,
  useGetCreditAccountWithUsersQuery,
} from "../../hooks/creditAccount";
import { CreditAccountUser } from "../../types/creditAccount";
import "./AddUserModal.scss";

export const AddUserModal = ({
  showModal,
  onCancel,
  onConfirm,
  userData,
}: {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  userData: CreditAccountUser;
}) => {
  const formMethods = useForm<{ comment: string }>({
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  const handleCancel = () => onCancel();

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };

  const { data: creditAccount } = useGetCreditAccountQuery();
  const {
    creditAccountUsers: {
      data: creditAccountUsers,
      refetch: refetchCreditAccountUsers,
    },
  } = useGetCreditAccountWithUsersQuery();

  const addCreditAccountUserMutation = useAddCreditAccountUserMutation();

  const handleAddUser = async () => {
    if (creditAccount?.creditAccountId) {
      const { status } = await addCreditAccountUserMutation.mutateAsync({
        creditAccountId: creditAccount.creditAccountId,
        companyId: userData.companyId,
      });

      if (isActionSuccessful(status)) {
        refetchCreditAccountUsers();
        onConfirm();
      }
    }
  };

  console.log(
    creditAccountUsers?.some(
      (user: CreditAccountUser) => user.companyId === userData.companyId,
    ),
  );

  return (
    <Dialog
      className="add-user-modal"
      open={showModal}
      onClose={handleCancel}
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
              <dd className="add-user-modal__value">{userData.legalName}</dd>
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
          {(userData.companyId === creditAccount?.companyId ||
            creditAccountUsers?.some(
              (user: CreditAccountUser) =>
                user.companyId === userData.companyId,
            )) && (
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
                    {creditAccountUsers[0]?.legalName}
                  </dt>
                </div>
                <div className="add-user-modal__item">
                  <dt className="add-user-modal__key">onRouteBC</dt>
                  <dt className="add-user-modal__value">
                    {creditAccountUsers[0]?.clientNumber}
                  </dt>
                </div>
                <div className="add-user-modal__item">
                  <dt className="add-user-modal__key">Credit Account No.</dt>
                  <dt className="add-user-modal__value">
                    {creditAccount?.creditAccountNumber}
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
            onClick={handleCancel}
            data-testid="cancel-add-user-button"
          >
            Cancel
          </Button>
          {userData.companyId !== creditAccount?.companyId && (
            <Button
              key="add-user-button"
              onClick={handleSubmit(handleAddUser)}
              className="add-user-button add-user-button--add-user"
              data-testid="add-user-button"
            >
              Add Account User
            </Button>
          )}
        </div>
      </FormProvider>
    </Dialog>
  );
};
