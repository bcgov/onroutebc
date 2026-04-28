import { Box, Button, Dialog } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import {
  useAddCreditAccountUserMutation,
  useGetCreditAccountMetadataQuery,
  useGetCreditAccountUsersQuery,
  useGetCreditAccountQuery,
} from "../../hooks/creditAccount";
import "./AddUserModal.scss";
import { OnRouteBCChip } from "../../../../common/components/chip/OnRouteBCChip";
import { ErrorAltBcGovBanner } from "../../../../common/components/banners/ErrorAltBcGovBanner";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { CREDIT_ACCOUNT_USER_TYPE } from "../../types/creditAccount";

export const AddUserModal = ({
  showModal,
  onCancel,
  onConfirm,
  userData,
  creditAccountId,
  companyId,
}: {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  userData: CompanyProfile;
  creditAccountId: number;
  companyId: number;
}) => {
  const formMethods = useForm<{ comment: string }>({
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };
  const { data: userCreditAccount, isLoading: isUserCreditAccountLoading } =
    useGetCreditAccountMetadataQuery(userData.companyId, true);

  const existingCreditAccountHolder =
    !isUserCreditAccountLoading && Boolean(userCreditAccount?.creditAccountId);

  const existingCreditAccountId = userCreditAccount?.creditAccountId;

  const { data: associatedCreditAccount } = useGetCreditAccountQuery(
    userData.companyId,
    getDefaultRequiredVal(0, existingCreditAccountId),
  );

  const { data: associatedCreditAccountUsers } = useGetCreditAccountUsersQuery({
    companyId: userData.companyId,
    creditAccountId: getDefaultRequiredVal(0, existingCreditAccountId),
  });

  const holder = associatedCreditAccountUsers?.find(
    (u) => u.userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER,
  );

  const { mutateAsync, isPending } = useAddCreditAccountUserMutation();

  const handleAddUser = async () => {
    if (creditAccountId) {
      const { status } = await mutateAsync({
        companyId,
        creditAccountId,
        userData,
      });

      if (isActionSuccessful(status)) {
        onConfirm();
      } else {
        console.error(`${status}: Failed to add credit account user.`);
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
        <h2 className="add-user-modal__title">Add Credit Account User</h2>
      </div>

      <FormProvider {...formMethods}>
        <div className="add-user-modal__body">
          {userData.isSuspended && (
            <Box className="add-user-modal__suspend__container">
              <div className="add-user-modal__suspend__banner">
                <ErrorAltBcGovBanner msg="Client is suspended" />
              </div>
              <div className="add-user-modal__suspend__info">
                <span>
                  A suspended client cannot be added as a Credit Account User
                </span>
              </div>
            </Box>
          )}
          <dl>
            <div className="add-user-modal__item">
              <dt className="add-user-modal__key">Client Name</dt>
              <dd className="add-user-modal__value">
                {userData.legalName}{" "}
                <div className="add-user-modal__suspend-chip">
                  {userData.isSuspended && (
                    <OnRouteBCChip message="Suspended" hoverText="SUSPENDED" />
                  )}
                </div>
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
            <div className="existing-holder-modal">
              <div className="existing-holder-modal__info">
                <div className="existing-holder-modal__header">
                  <InfoBcGovBanner msg="This client already is a Credit Account Holder or User of:" />
                </div>

                <div className="existing-holder-modal__body">
                  {holder?.legalName ? (
                    <div className="existing-holder-modal__item">
                      <div className="existing-holder-modal__key">
                        Client Name
                      </div>
                      <div className="existing-holder-modal__value">
                        {holder.legalName}
                      </div>
                    </div>
                  ) : null}

                  {holder?.clientNumber ? (
                    <div className="existing-holder-modal__item">
                      <div className="existing-holder-modal__key">
                        onRouteBC Client No.
                      </div>
                      <div className="existing-holder-modal__value">
                        {holder.clientNumber}
                      </div>
                    </div>
                  ) : null}

                  {associatedCreditAccount?.creditAccountNumber ? (
                    <div className="existing-holder-modal__item">
                      <div className="existing-holder-modal__key">
                        Credit Account No.
                      </div>
                      <div className="existing-holder-modal__value">
                        {associatedCreditAccount.creditAccountNumber}
                      </div>
                    </div>
                  ) : null}
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
            Close
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
