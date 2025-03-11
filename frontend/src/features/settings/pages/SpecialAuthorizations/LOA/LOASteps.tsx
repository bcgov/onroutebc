import { useContext, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import "./LOASteps.scss";
import { LOAStep, LOA_STEPS, labelForLOAStep } from "../../../types/LOAStep";
import { LOAReview } from "./review/LOAReview";
import { LOABasicInfo } from "./basic/LOABasicInfo";
import { Nullable } from "../../../../../common/types/common";
import { LOAFormData, loaDetailToFormData } from "../../../types/LOAFormData";
import { ERROR_ROUTES } from "../../../../../routes/constants";
import { SnackBarContext } from "../../../../../App";
import { usePowerUnitSubTypesQuery } from "../../../../manageVehicles/hooks/powerUnits";
import { useTrailerSubTypesQuery } from "../../../../manageVehicles/hooks/trailers";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import {
  useCreateLOAMutation,
  useFetchLOADetail,
  useRemoveLOADocumentMutation,
  useUpdateLOAMutation,
} from "../../../hooks/LOA";

export const LOASteps = ({
  loaId,
  companyId,
  onExit,
}: {
  loaId?: Nullable<number>;
  companyId: number;
  onExit: () => void;
}) => {
  const navigate = useNavigate();
  const { setSnackBar } = useContext(SnackBarContext);
  const { data: loaDetail } = useFetchLOADetail(companyId, loaId);
  const createLOAMutation = useCreateLOAMutation();
  const updateLOAMutation = useUpdateLOAMutation();
  const removeLOADocumentMutation = useRemoveLOADocumentMutation();
  const loaFormData = loaDetailToFormData(loaDetail);

  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();
  const powerUnitSubtypes = useMemo(() => getDefaultRequiredVal(
    [],
    powerUnitSubTypesQuery.data,
  ), [powerUnitSubTypesQuery.data]);

  const trailerSubtypes = useMemo(() => getDefaultRequiredVal(
    [],
    trailerSubTypesQuery.data,
  ), [trailerSubTypesQuery.data]);

  const formMethods = useForm<LOAFormData>({
    defaultValues: loaFormData,
    reValidateMode: "onChange",
  });

  const { handleSubmit, reset, getValues } = formMethods;

  useEffect(() => {
    reset(loaDetailToFormData(loaDetail));
  }, [loaDetail]);

  const [activeStep, setActiveStep] = useState<LOAStep>(LOA_STEPS.BASIC);
  const stepLabel = labelForLOAStep(activeStep, loaId);
  const showPrevBtn = activeStep === LOA_STEPS.REVIEW;
  const showNextBtn = activeStep === LOA_STEPS.BASIC;
  const showFinishBtn = activeStep === LOA_STEPS.REVIEW;

  const handlePrev = () => {
    if (activeStep === LOA_STEPS.REVIEW) {
      setActiveStep(LOA_STEPS.BASIC);
    }
  };

  const handleNext = () => {
    if (activeStep === LOA_STEPS.BASIC) {
      setActiveStep(LOA_STEPS.REVIEW);
    }
  };

  const handleFinish = async () => {
    // Handle submitting LOA
    const isLOACreation = !loaId;
    const res = isLOACreation
      ? await createLOAMutation.mutateAsync({
          companyId,
          data: getValues(),
        })
      : await updateLOAMutation.mutateAsync({
          companyId,
          loaId,
          data: getValues(),
        });

    if (res.status === 200 || res.status === 201) {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: isLOACreation ? `LOA Added` : `LOA Updated`,
        alertType: isLOACreation ? "success" : "info",
      });
      onExit();
    } else {
      const correlationId = res.headers["x-correlation-id"];
      navigate(ERROR_ROUTES.UNEXPECTED, { state: { correlationId } });
    }
  };

  const handleRemoveDocument = async () => {
    if (!loaId) return true; // Free to remove newly loaded documents for not-yet created LOAs

    try {
      const res = await removeLOADocumentMutation.mutateAsync({
        companyId,
        loaId,
      });

      return res.status === 200;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const stepComponent = useMemo(() => {
    switch (activeStep) {
      case LOA_STEPS.REVIEW:
        return (
          <LOAReview
            powerUnitSubtypes={powerUnitSubtypes}
            trailerSubtypes={trailerSubtypes}
          />
        );
      default:
        return (
          <LOABasicInfo
            onRemoveDocument={handleRemoveDocument}
            powerUnitSubtypes={powerUnitSubtypes}
            trailerSubtypes={trailerSubtypes}
          />
        );
    }
  }, [activeStep]);

  return (
    <FormProvider {...formMethods}>
      <div className="loa-steps">
        <h3 className="loa-steps__step-label">
          {stepLabel}
        </h3>

        <div className="loa-steps__step-component">{stepComponent}</div>

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
              startIcon={<FontAwesomeIcon icon={faPencil} />}
              className="steps-navigation__btn steps-navigation__btn--prev"
            >
              <strong>Edit</strong>
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
            >
              Continue
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
