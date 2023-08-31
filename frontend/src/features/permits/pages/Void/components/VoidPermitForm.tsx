import { Controller, FormProvider } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import { useNavigate } from "react-router-dom";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";

import "./VoidPermitForm.scss";
import { WarningBcGovBanner } from "../../../../../common/components/banners/AlertBanners";
import { feeSummaryDisplayText } from "../../../helpers/mappers";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { invalidEmail, invalidPhoneLength, requiredMessage } from "../../../../../common/helpers/validationMessages";
import { useVoidPermitForm } from "../hooks/useVoidPermitForm";
import { VoidPermitHeader } from "./VoidPermitHeader";
import { ReadPermitDto } from "../../../types/permit";
import { SEARCH_RESULTS } from "../../../../../routes/constants";

const getDisabledClassName = (disabled: boolean, enabledClassName: string, prefix: string) => {
  return disabled ? `${prefix}--disabled` : enabledClassName;
};

const FEATURE = "void-permit";
const searchRoute = `${SEARCH_RESULTS}?searchEntity=permits`;

export const VoidPermitForm = ({
  permit,
}: {
  permit?: ReadPermitDto,
}) => {
  const navigate = useNavigate();
  const {
    shouldRevoke,
    formMethods,
    handleReasonChange,
    handleRevokeChange,
    handleRefundChange,
    setVoidPermitData,
    next,
  } = useVoidPermitForm();

  const feeDisplayText = feeSummaryDisplayText(
    permit?.permitData?.feeSummary, 
    permit?.permitData?.permitDuration
  );

  const { control, getValues, handleSubmit } = formMethods;

  const handleCancel = () => {
    navigate(searchRoute);
  };

  const handleVoid = () => {
    const formValues = getValues();
    setVoidPermitData(formValues);
    console.log(formValues); //
    next();
  };

  return (
    <FormProvider {...formMethods}>
      <VoidPermitHeader permit={permit} />
      <div className="void-permit__form">
        <div className="form-section form-section--reason">
          <div className="form-section__label">
            Reason for Voiding
          </div>
          <div className="form-section__input-area">
            <Controller
              name="reason"
              control={control}
              render={({ field: { value }}) => (
                <textarea 
                  name="reason" 
                  className="void-input void-input--reason"
                  rows={3}
                  defaultValue={value}
                  onChange={(e) => handleReasonChange(e.target.value)}
                >
                </textarea>
              )}
            />
          </div>
        </div>
        <div className="form-section form-section--revoke">
          <div className="form-section__label">
            Revoke Permit?
          </div>
          <div className="form-section__input-area">
            <WarningBcGovBanner 
              description="Revoking a permit is a severe action that cannot be reversed." 
            />
            <Controller
              control={control}
              name="revoke"
              render={({ field: { value } }) => (
                <RadioGroup
                  className="void-input void-input--revoke"
                  defaultValue={value}
                  value={value}
                  onChange={(e) => handleRevokeChange(e.target.value)}
                >
                  <FormControlLabel
                    className="radio-label"
                    label="Yes"
                    value={true}
                    control={
                      <Radio 
                        key="revoke-permit-yes"
                      />
                    }
                  />
                  <FormControlLabel
                    className="radio-label"
                    label="No"
                    value={false}
                    control={
                      <Radio 
                        key="revoke-permit-no"
                      />
                    }
                  />
                </RadioGroup>
              )}
            />
          </div>
        </div>
        <div className={`form-section ${getDisabledClassName(shouldRevoke, "form-section--refund", "form-section")}`}>
          <div className="form-section__label">
            Refund Permit Fees?
          </div>
          <div className="form-section__input-area">
            <div className="fee-summary">
              <div className="fee-summary__header">
                <div className="fee-summary__title">
                  Fee Summary
                </div>
                <div 
                  className="fee-summary__amount"
                  data-testid="fee-summary-amount"
                >
                  {feeDisplayText}
                </div>
              </div>
              <Controller
                control={control}
                name="refund"
                render={({ field: { value } }) => (
                  <RadioGroup
                    className="void-input void-input--refund"
                    defaultValue={value}
                    value={value}
                    onChange={(e) => handleRefundChange(e.target.value)}
                  >
                    <FormControlLabel
                      className="radio-label"
                      label={
                        <span className="radio-label__text">
                          Refund
                        </span>
                      }
                      value={true}
                      control={
                        <Radio 
                          key="refund-permit-yes"
                          className="radio"
                          disabled={shouldRevoke}
                        />
                      }
                    />
                    <FormControlLabel
                      className="radio-label"
                      label={
                        <span className="radio-label__text">
                          {"Don't Refund"}
                        </span>
                      }
                      value={false}
                      control={
                        <Radio 
                          key="refund-permit-no"
                          className="radio"
                          disabled={shouldRevoke}
                        />
                      }
                    />
                  </RadioGroup>
                )}
              />
            </div>
          </div>
        </div>
        <div className="form-section form-section--send">
          <div className="form-section__label">
            Send Permit and Receipt to
          </div>
          <div className="form-section__input-area">
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "email",
                rules: {
                  required: { value: true, message: requiredMessage() },
                  validate: {
                    validateEmail: (email: string) =>
                      isEmail(email) || invalidEmail(),
                  },
                },
                label: "Email",
              }}
              className="void-input void-input--email"
            />
            <CustomFormComponent
              type="phone"
              feature={FEATURE}
              options={{
                name: "fax",
                rules: { 
                  required: false,
                  validate: {
                    validateFax: (fax?: string) =>
                      (fax == null || fax === "")
                        || (fax != null && fax !== "" && fax.length >= 10 && fax.length <= 20)
                        || invalidPhoneLength(10, 20),
                  },
                },
                label: "Fax",
              }}
              className="void-input void-input--fax"
            />
          </div>
        </div>
        <div className="form-section form-section--submit">
          <div className="form-section__label"></div>
          <div className="form-section__input-area">
            <Button
              key="cancel-void-button"
              aria-label="Cancel"
              variant="contained"
              color="tertiary"
              className="void-permit-button void-permit-button--cancel"
              onClick={handleCancel}
              data-testid="cancel-void-permit-button"
            >
              Cancel
            </Button>
            <Button
              key="submit-void-button"
              aria-label="Void Permit"
              variant="contained"
              color="primary"
              onClick={handleSubmit(handleVoid)}
              className="void-permit-button void-permit-button--void"
              data-testid="submit-void-permit-button"
            >
              Void Permit
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>    
  );
};
