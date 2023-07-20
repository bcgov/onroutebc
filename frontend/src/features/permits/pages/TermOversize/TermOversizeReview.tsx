import { Box, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

import { WarningBcGovBanner } from "../../../../common/components/banners/AlertBanners";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { ApplicationDetails } from "../../components/form/ApplicationDetails";
import { ApplicationContext } from "../../context/ApplicationContext";
import { Application } from "../../types/application";
import { useSaveTermOversizeMutation } from "../../hooks/hooks";
import { ReviewContactDetails } from "./review/ReviewContactDetails";
import { ReviewFeeSummary } from "./review/ReviewFeeSummary";
import { ReviewPermitDetails } from "./review/ReviewPermitDetails";
import { ReviewVehicleInfo } from "./review/ReviewVehicleInfo";
import { ProgressBar } from "../../components/progressBar/ProgressBar";

export const TermOversizeReview = () => {
  const { applicationData, setApplicationData, back, next } =
    useContext(ApplicationContext);

  const methods = useForm<Application>();

  // For the confirmation checkboxes
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Send data to the backend API
  const submitTermOversizeMutation = useSaveTermOversizeMutation();
  const onSubmit = async () => {
    setIsSubmitted(true);

    if (!isChecked) return;

    if (applicationData) {
      const response = await submitTermOversizeMutation.mutateAsync(
        applicationData
      );
      const data = response.data;
      setApplicationData(data);
    }
    next();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ProgressBar />
      <Box
        className="layout-box"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Box sx={{ paddingBottom: "80px", marginTop: "-40px" }}>
          <WarningBcGovBanner
            description="Please review and confirm that the information below is correct."
            width="668px"
          />
          <ApplicationDetails
            permitType={applicationData?.permitType}
            applicationNumber={applicationData?.applicationNumber}
            createdDateTime={applicationData?.createdDateTime}
            updatedDateTime={applicationData?.updatedDateTime}
          />
          <ReviewContactDetails values={applicationData} />
          <ReviewPermitDetails values={applicationData} />
          <ReviewVehicleInfo values={applicationData} />
          <FormProvider {...methods}>
            <ReviewFeeSummary
              isSubmitted={isSubmitted}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
            />
            <Box
              sx={{
                backgroundColor: BC_COLOURS.white,
                paddingTop: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                key="save-TROS-button"
                aria-label="save"
                variant="contained"
                color="tertiary"
                onClick={() => back()}
                sx={{
                  marginRight: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FontAwesomeIcon icon={faPencil} />
                Edit
              </Button>
              <Button
                key="submit-TROS-button"
                aria-label="Submit"
                variant="contained"
                color="primary"
                onClick={methods.handleSubmit(onSubmit)}
                data-testid="proceed-pay-btn"
              >
                Proceed to Pay
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Box>
    </>
  );
};
