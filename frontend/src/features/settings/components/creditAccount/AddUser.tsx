import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { Box, Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { AddUserModal } from "./AddUserModal";
import { getCompanyDataBySearch } from "../../../idir/search/api/idirSearch";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import "./AddUser.scss";
import { SnackBarContext } from "../../../../App";

interface SearchClientFormData {
  clientNumber: string;
}

const FEATURE = "client-search";

export const AddUser = () => {
  const { setSnackBar } = useContext(SnackBarContext);

  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<CompanyProfile>();

  const formMethods = useForm<SearchClientFormData>({
    defaultValues: {
      clientNumber: "",
    },
  });

  const { handleSubmit, setError } = formMethods;

  const onSubmit = async (data: FieldValues) => {
    const response = await getCompanyDataBySearch(
      {
        searchEntity: "companies",
        searchByFilter: "onRouteBCClientNumber",
        searchString: data.clientNumber,
      },
      {
        page: 0,
        take: 1,
      },
    );
    if (response.items.length !== 0) {
      setUserData(response.items[0]);
      setShowAddUserModal(true);
    } else {
      setError("clientNumber", {
        type: "manual",
        message: "Client No. not found",
      });
    }
  };

  const handleAddUser = () => {
    setShowAddUserModal(false);
    setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      alertType: "success",
      message: "Account User Added",
    });
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
            onClick={handleSubmit(onSubmit)}
          >
            Search
          </Button>
        </Box>
      </FormProvider>
      {userData && showAddUserModal ? (
        <AddUserModal
          showModal={showAddUserModal}
          onCancel={() => setShowAddUserModal(false)}
          onConfirm={handleAddUser}
          userData={userData}
        />
      ) : null}
    </div>
  );
};
