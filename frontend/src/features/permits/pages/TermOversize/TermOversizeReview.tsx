import { Box, Button } from "@mui/material";
import { useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
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

  // Send data to the backend API
  const submitTermOversizeQuery = useSaveTermOversizeMutation();
  const onSubmit = async () => {
    if (applicationData) {
      const response = await submitTermOversizeQuery.mutateAsync(
        applicationData
      );
      const data = await response.data;
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
          <ApplicationDetails values={applicationData} />
          <ReviewContactDetails values={applicationData} />
          <ReviewPermitDetails values={applicationData} />
          <ReviewVehicleInfo values={applicationData} />
          <FormProvider {...methods}>
            <ReviewFeeSummary />
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
                color="secondary"
                onClick={() => back()}
                sx={{ marginRight: "24px" }}
              >
                Edit Application
              </Button>
              <Button
                key="submit-TROS-button"
                aria-label="Submit"
                variant="contained"
                color="primary"
                onClick={methods.handleSubmit(onSubmit)}
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
