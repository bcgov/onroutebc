import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button, Step, StepConnector, StepLabel, Stepper } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import "./LOASteps.scss";
import { LOAStep, LOA_STEPS, labelForLOAStep } from "../../../types/LOAStep";
import { LOADesignateVehicles } from "./vehicles/LOADesignateVehicles";
import { LOAReview } from "./review/LOAReview";
import { LOABasicInfo } from "./basic/LOABasicInfo";
import { Nullable } from "../../../../../common/types/common";
import { LOAFormData, loaDetailToFormData } from "../../../types/LOAFormData";
import { useFetchLOADetail } from "../../../hooks/LOA";

export const LOASteps = ({
  loaNumber,
  companyId,
  onExit,
}: {
  loaNumber?: Nullable<string>;
  companyId: number;
  onExit: () => void;
}) => {
  const steps = [
    labelForLOAStep(LOA_STEPS.BASIC),
    labelForLOAStep(LOA_STEPS.VEHICLES),
    labelForLOAStep(LOA_STEPS.REVIEW),
  ];

  const { data: loaDetail } = useFetchLOADetail(companyId, loaNumber);
  const loaFormData = loaDetailToFormData(loaDetail);

  const formMethods = useForm<LOAFormData>({
    defaultValues: loaFormData,
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  const [activeStep, setActiveStep] = useState<LOAStep>(LOA_STEPS.BASIC);

  const showPrevBtn = activeStep === LOA_STEPS.VEHICLES || activeStep === LOA_STEPS.REVIEW;
  const showNextBtn = activeStep === LOA_STEPS.BASIC || activeStep === LOA_STEPS.VEHICLES;
  const showFinishBtn = activeStep === LOA_STEPS.REVIEW;

  const handlePrev = () => {
    if (activeStep === LOA_STEPS.VEHICLES) {
      setActiveStep(LOA_STEPS.BASIC);
    } else if (activeStep === LOA_STEPS.REVIEW) {
      setActiveStep(LOA_STEPS.VEHICLES);
    }
  };

  const handleNext = () => {
    if (activeStep === LOA_STEPS.BASIC) {
      setActiveStep(LOA_STEPS.VEHICLES);
    } else if (activeStep === LOA_STEPS.VEHICLES) {
      setActiveStep(LOA_STEPS.REVIEW);
    }
  };

  const handleFinish = () => {
    // Handle submitting LOA
    onExit();
  };

  const stepComponent = useMemo(() => {
    switch (activeStep) {
      case LOA_STEPS.VEHICLES:
        return <LOADesignateVehicles />;
      case LOA_STEPS.REVIEW:
        return <LOAReview />;
      default:
        return <LOABasicInfo />;
    }
  }, [activeStep]);
  
  return (
    <FormProvider {...formMethods}>
      <div className="loa-steps">
        <Stepper
          className="stepper"
          activeStep={activeStep}
          alternativeLabel
          connector={
            <StepConnector
              className="step__connector"
              classes={{ line: "step__connector-line" }}
            />
          }
        >
          {steps.map((label, stepIndex) => (
            <Step
              className={`step ${stepIndex === 0 ? "step--first" : ""}`}
              key={label}
            >
              <StepLabel
                className="step__label"
                classes={{
                  labelContainer: "step__label-container",
                  active: "step__label--active",
                  disabled: "step__label--disabled",
                  completed: "step__label--completed",
                }}
                StepIconProps={{
                  className: "step__icon",
                  classes: {
                    text: "step__step-number",
                    active: "step__icon--active",
                    completed: "step__icon--completed",
                  }
                }}
              >{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="loa-steps__step-component">
          {stepComponent}
        </div>

        <div className="steps-navigation">
          <Button
            key="exit-loa-button"
            aria-label="Exit LOA Details"
            variant="contained"
            color="tertiary"
            className="steps-navigation__btn steps-navigation__btn--cancel"
            onClick={onExit}
            data-testid="exit-loa-button"
          >
            Cancel
          </Button>

          {showPrevBtn ? (
            <Button
              key="loa-prev-button"
              data-testid="loa-prev-button"
              onClick={handlePrev}
              variant="contained"
              color="secondary"
              startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
              className="steps-navigation__btn steps-navigation__btn--prev"
            >
              <strong>Previous</strong>
            </Button>
          ) : null}

          {showNextBtn ? (
            <Button
              key="loa-next-button"
              data-testid="loa-next-button"
              className="steps-navigation__btn steps-navigation__btn--next"
              onClick={handleSubmit(handleNext)}
              variant="contained"
              color="primary"
              endIcon={<FontAwesomeIcon icon={faArrowRight} />}
            >
              Next
            </Button>
          ) : null}

          {showFinishBtn ? (
            <Button
              key="loa-finish-button"
              data-testid="loa-finish-button"
              onClick={handleFinish}
              variant="contained"
              color="primary"
              className="steps-navigation__btn steps-navigation__btn--finish"
            >
              Finish
            </Button>
          ) : null}
        </div>
      </div>
    </FormProvider>
  );
};
