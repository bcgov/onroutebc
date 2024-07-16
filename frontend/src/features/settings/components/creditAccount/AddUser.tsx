import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AddUserModal } from "./AddUserModal";
import {
  useGetCompanyQuery,
  useGetCreditAccountQuery,
} from "../../hooks/creditAccount";
import "./AddUser.scss";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

interface SearchClientFormData {
  clientNumber: string;
}

const FEATURE = "client-search";

export const AddUser = () => {
  const { companyId } = useContext(OnRouteBCContext);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [clientNumber, setClientNumber] = useState<string>("");

  const { data: companyData, isLoading } = useGetCompanyQuery(clientNumber);

  const { refetch: refetchCreditAccount } = useGetCreditAccountQuery(
    getDefaultRequiredVal(0, companyId),
  );

  const formMethods = useForm<SearchClientFormData>({
    defaultValues: {
      clientNumber: "",
    },
  });

  const { handleSubmit, setError, reset: resetForm } = formMethods;

  const onSubmit = async (data: FieldValues) => {
    setClientNumber(data.clientNumber);
  };

  useEffect(() => {
    if (companyData) {
      if (companyData.items.length === 0) {
        setError("clientNumber", {
          type: "manual",
          message: "Client No. not found",
        });
      } else {
        setShowAddUserModal(true);
      }
    }
  }, [companyData]);

  const confirmAddUser = () => {
    resetForm();
    setClientNumber("");
    setShowAddUserModal(false);
    refetchCreditAccount();
  };

  const handleCloseAddUserModal = () => {
    setClientNumber("");
    setShowAddUserModal(false);
  };

  return (
    <div className="add-user">
      <Typography variant="h3" className="overview__title">
        Add Credit Account User
      </Typography>

      <FormProvider {...formMethods}>
        <Box className="add-user__form">
          <CustomFormComponent
            className="add-user__input"
            type="input"
            feature={FEATURE}
            options={{
              name: "clientNumber",
              rules: {
                required: {
                  value: true,
                  message: requiredMessage(),
                },
                pattern: {
                  value: /^[A-Z][1-9]-\d{6}-\d{3}$/,
                  message:
                    "Client number must follow the correct format, e.g. XX-XXXXXX-XXX",
                },
              },
              label: "Client Number",
            }}
          ></CustomFormComponent>
          <Button
            className="add-user__button"
            variant="contained"
            color="secondary"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Search
          </Button>
        </Box>
      </FormProvider>
      {showAddUserModal && companyData ? (
        <AddUserModal
          showModal={showAddUserModal}
          onCancel={handleCloseAddUserModal}
          onConfirm={confirmAddUser}
          userData={companyData?.items[0]}
        />
      ) : null}
    </div>
  );
};
