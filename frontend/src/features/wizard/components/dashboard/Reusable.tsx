import { Alert, Button, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { WizardCompanyBanner } from "../../subcomponents/WizardCompanyBanner";
import { CompanyInformationWizardForm } from "../../subcomponents/CompanyInformationWizardForm";
import { UserInformationWizardForm } from "../../subcomponents/UserInformationWizardForm";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { Dispatch, SetStateAction, useContext } from "react";
import { CompanyAndUserRequest } from "../../../manageProfile/types/manageProfile";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { useAuth } from "react-oidc-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOnRouteBCProfile } from "../../../manageProfile/apiManager/manageProfileAPI";
import { Nullable } from "vitest";
import { SnackBarContext } from "../../../../App";
import { useNavigate } from "react-router-dom";

/**
 * Gets the section name inside the form for a particular field name
 * @param field - Field name inside the form (eg. primaryContact.firstName)
 * @returns Name of the section in the form that the field belongs to (eg. Company Primary Contact)
 */
const getSectionNameByField = (field: string) => {
  const sectionParts = field.split(".");

  switch (sectionParts[0]) {
    case "mailingAddress":
      return "Company Mailing Address";
    case "primaryContact":
      return "Company Primary Contact";
    case "adminUser":
      return "User Details";
    default:
      return "Company Contact Details";
  }
};

const getFirstValidationError = (
  errors: { field: string; message: string[] }[],
) => {
  if (errors.length === 0 || errors[0].message.length === 0) return undefined;
  return `${getSectionNameByField(errors[0].field)} validation error: ${
    errors[0].message[0]
  }`;
};

export const Reusable = ({
  setClientNumber,
  activeStep,
  setActiveStep,
}: {
  setClientNumber: Dispatch<SetStateAction<Nullable<string>>>;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}) => {
  const navigate = useNavigate();
  const {
    setCompanyId,
    setUserDetails,
    setCompanyLegalName,
    setOnRouteBCClientNumber,
    setMigratedClient,
    migratedClient,
  } = useContext(OnRouteBCContext);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { setSnackBar } = useContext(SnackBarContext);

  console.log('migratedClient in company form::', migratedClient);

  const companyAndUserFormMethods = useForm<CompanyAndUserRequest>({
    defaultValues: {
      legalName: getDefaultRequiredVal(
        "",
        user?.profile?.bceid_business_name as string,
      ),
      alternateName: getDefaultRequiredVal("", migratedClient?.alternateName),
      mailingAddress: {
        addressLine1: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.addressLine1,
        ),
        addressLine2: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.addressLine2,
        ),
        provinceCode: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.provinceCode,
        ),
        countryCode: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.countryCode,
        ),
        city: getDefaultRequiredVal("", migratedClient?.mailingAddress?.city),
        postalCode: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.postalCode,
        ),
      },
      email: getDefaultRequiredVal("", user?.profile?.email),
      phone: getDefaultRequiredVal("", migratedClient?.phone),
      extension: getDefaultRequiredVal("", migratedClient?.extension),
      fax: getDefaultRequiredVal("", migratedClient?.fax),
      adminUser: {
        firstName: "",
        lastName: "",
        email: "",
        phone1: "",
        phone1Extension: "",
        phone2: "",
        phone2Extension: "",
        fax: "",
        countryCode: "",
        provinceCode: "",
        city: "",
      },
      primaryContact: {
        firstName: "",
        lastName: "",
        email: "",
        phone1: "",
        phone1Extension: "",
        phone2: "",
        phone2Extension: "",
        countryCode: "",
        provinceCode: "",
        city: "",
      },
    },
  });
  const { handleSubmit: handleCreateProfileSubmit, register } =
    companyAndUserFormMethods;

  const createProfileQuery = useMutation({
    mutationFn: createOnRouteBCProfile,
    onSuccess: async (response) => {
      if (response.status === 200 || response.status === 201) {
        const responseBody = response.data;
        const companyId = responseBody["companyId"];
        const companyName = responseBody["legalName"];
        const clientNumber = responseBody["clientNumber"];
        const userDetails = {
          firstName: responseBody.adminUser?.firstName,
          lastName: responseBody.adminUser?.lastName,
          userName: responseBody.adminUser?.userName,
          phone1: responseBody.adminUser?.phone1,
          phone1Extension: responseBody.adminUser?.phone1Extension,
          phone2: responseBody.adminUser?.phone2,
          phone2Extension: responseBody.adminUser?.phone2Extension,
          email: responseBody.adminUser?.email,
          fax: responseBody.adminUser?.fax,
          userAuthGroup: responseBody.adminUser?.userAuthGroup,
        };
        setUserDetails?.(() => userDetails);
        setCompanyId?.(() => companyId);
        setCompanyLegalName?.(() => companyName);
        setOnRouteBCClientNumber?.(() => clientNumber);

        // Clear any state in migrated client. We no longer need this
        // once the user has successfully created/claimed their company.
        setMigratedClient?.(() => undefined);

        // Setting the companyId in the sessionStorage so that it can be used
        // used outside of react components;
        sessionStorage.setItem("onRouteBC.user.companyId", companyId);

        setClientNumber(() => responseBody["clientNumber"]);
        queryClient.invalidateQueries(["userContext"]);
      } else if (response.status === 400) {
        const { error } = response.data;
        const firstErrMsg = getFirstValidationError(
          getDefaultRequiredVal([], error),
        );
        if (firstErrMsg) {
          setSnackBar({
            message: firstErrMsg,
            showSnackbar: true,
            setShowSnackbar: () => true,
            alertType: "error",
          });
        }
      }
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /**
   * On Click function for the Finish button
   * Validates and submits the form data to the API
   * @param data The form data.
   */
  const onClickFinish = function (data: CompanyAndUserRequest) {
    const profileToBeCreated = data;
    createProfileQuery.mutate(profileToBeCreated);
  };

  return (
    <FormProvider {...companyAndUserFormMethods}>
      <input type="hidden" {...register("legalName")} />
      {activeStep !== 0 && (
        <div className="create-profile-section create-profile-section--info">
          <Alert severity="info">
            <Typography>
              <strong>
                Please note, unless stated otherwise, all fields are mandatory.
              </strong>
            </Typography>
          </Alert>
        </div>
      )}
      {activeStep === 1 && (
        <div className="create-profile-section create-profile-section--company">
          <WizardCompanyBanner
            legalName={getDefaultRequiredVal(
              "",
              user?.profile?.bceid_business_name as string,
            )}
          />
          <CompanyInformationWizardForm />
        </div>
      )}
      {activeStep === 2 && (
        <div className="create-profile-section create-profile-section--user">
          <h2>User Details</h2>
          <hr></hr>
          <UserInformationWizardForm />
        </div>
      )}
      <div className="create-profile-section create-profile-section--nav">
        {activeStep === 1 && (
          <Stack direction="row" spacing={3}>
            <Button
              key="cancel-create-profile-button"
              aria-label="Cancel Create Profile"
              variant="contained"
              color="secondary"
              onClick={() => {
                // Go back
                navigate(-1);
              }}
              disableElevation
              sx={{
                ":hover": {
                  background: BC_COLOURS.bc_background_light_grey,
                  border: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
                },
                border: `2px solid ${BC_COLOURS.white}`,
                borderRadius: "4px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBack}
              variant="contained"
              color="secondary"
              startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
              className="proceed-btn proceed-btn--prev"
              sx={{
                ":hover": {
                  background: BC_COLOURS.bc_text_links_blue,
                  border: `2px solid ${BC_COLOURS.bc_text_links_blue}`,
                },
                border: `2px solid ${BC_COLOURS.bc_primary_blue}`,
                borderRadius: "4px",
                color: `${BC_COLOURS.bc_primary_blue}`,
                background: `${BC_COLOURS.white}`,
              }}
            >
              <strong>Previous</strong>
            </Button>
            <Button
              className="proceed-btn proceed-btn--next"
              onClick={handleCreateProfileSubmit(handleNext)}
              variant="contained"
              color="primary"
              endIcon={<FontAwesomeIcon icon={faArrowRight} />}
            >
              Next
            </Button>
          </Stack>
        )}
        {activeStep === 2 && (
          <>
            <Button
              onClick={handleBack}
              variant="contained"
              color="secondary"
              startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
              className="proceed-btn proceed-btn--prev"
            >
              Previous
            </Button>
            <Button
              onClick={handleCreateProfileSubmit(onClickFinish)}
              variant="contained"
              className="proceed-btn proceed-btn--finish"
            >
              Finish
            </Button>
          </>
        )}
      </div>
    </FormProvider>
  );
};
