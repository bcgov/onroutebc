import { useContext, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select } from "@mui/material";

import "./FinishVoid.scss";
import { VoidPermitContext } from "./context/VoidPermitContext";
import { RefundVoidDto } from "./types/RefundVoidDto";
import { getErrorMessage } from "../../../../common/components/form/CustomFormComponents";
import { ReadPermitDto } from "../../types/permit";
import { permitTypeDisplayText } from "../../helpers/mappers";
import { FeeSummary } from "./components/FeeSummary";
import { requiredMessage } from "../../../../common/helpers/validationMessages";

export const FinishVoid = ({
  permit,
}: {
  permit?: ReadPermitDto;
}) => {
  const { 
    voidPermitData: {
      email,
      fax,
      reason,
    },
  } = useContext(VoidPermitContext);

  const [shouldUsePrevPaymentMethod, setShouldUsePrevPaymentMethod] = useState<boolean>(true);
  const paymentMethod = {
    value: 2,
    label: "Icepay - Mastercard (Debit)",
  }; // hardcoded value

  const formMethods = useForm<RefundVoidDto>({
    defaultValues: {
      shouldUsePrevPaymentMethod,
      paymentMethod: paymentMethod.value,
      transactionId: "",
    },
    reValidateMode: "onChange",
  });

  const { 
    control, 
    getValues, 
    handleSubmit, 
    setValue, 
    formState: { errors },
    register,
    clearErrors,
  } = formMethods;

  const handleRefundMethodChange = (shouldUsePrev: string) => {
    const usePrev = shouldUsePrev === "true";
    setShouldUsePrevPaymentMethod(usePrev);
    setValue("shouldUsePrevPaymentMethod", usePrev);
    clearErrors("transactionId");
  };

  const transactionIdRules = {
    validate: {
      requiredWhenSelected: (value: string | undefined, formValues: RefundVoidDto) => {
        return !formValues.shouldUsePrevPaymentMethod
          || (value != null && value.trim() !== "")
          || requiredMessage();
      }
    },
  };

  const handleFinish = () => {
    const formValues = getValues();
    console.log(formValues); //
  };

  return (
    <div className="finish-void">
      <div className="finish-void-section finish-void-section--left">
        <div className="void-info void-info--transactions">
          <div className="void-info__header">
            Transaction History
          </div>
          <div className="transaction-history-table"></div>
        </div>
        <div className="void-info void-info--send">
          <div className="void-info__header">
            Send Permit and Receipt to
          </div>
          <div className="void-info__info">
            <span className="info-label">Email: </span>
            <span 
              className="info-value"
              data-testid="send-to-email"
            >
              {email}
            </span>
          </div>
          {fax ? (
            <div className="void-info__info">
              <span className="info-label">Fax: </span>
              <span 
                className="info-value"
                data-testid="send-to-fax"
              >
                {fax}
              </span>
            </div>
          ) : null}
        </div>
        <div className="void-info void-info--reason">
          <div className="void-info__header">Reason for Voiding</div>
          <div className="void-info__info">
            {reason}
          </div>
        </div>
      </div>
      <div className="finish-void-section finish-void-section--right">
        <div className="void-info void-info--refund-methods">
          <div className="void-info__header">
            Choose a Refund Method
          </div>
          <FormProvider {...formMethods}>
            <Controller
              control={control}
              name="shouldUsePrevPaymentMethod"
              render={({ field: { value } }) => (
                <RadioGroup
                  className="refund-methods"
                  defaultValue={value}
                  value={value}
                  onChange={(e) => handleRefundMethodChange(e.target.value)}
                >
                  <div 
                    className={`refund-method ${shouldUsePrevPaymentMethod ? "refund-method--active" : ""}`}
                  >
                    <FormControlLabel
                      className="radio-label"
                      label="Refund to Previous Payment Method"
                      value={true}
                      control={
                        <Radio 
                          key="refund-by-prev-payment-method"
                        />
                      }
                    />
                    <div className="refund-payment">
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field: { value }}) => (
                          <FormControl className="refund-payment__info refund-payment__info--method">
                            <FormLabel className="refund-payment__label">
                              Payment Method
                            </FormLabel>
                            <Select
                              className="refund-payment__input refund-payment__input--method"
                              disabled={true}
                              defaultValue={value}
                            >
                              <MenuItem value={paymentMethod.value}>
                                {paymentMethod.label}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="transactionId"
                        control={control}
                        rules={transactionIdRules}
                        render={({ field: { value }, fieldState: { invalid } }) => (
                          <FormControl 
                            className="refund-payment__info refund-payment__info--transaction"
                            error={invalid}
                          >
                            <FormLabel className="refund-payment__label">
                              Transaction ID
                            </FormLabel>
                            <OutlinedInput
                              className={`refund-payment__input refund-payment__input--transaction ${invalid ? "refund-payment__input--err" : ""}`}
                              defaultValue={value}
                              {...register("transactionId", transactionIdRules)}
                            />
                            {invalid ? (
                              <FormHelperText 
                                className="refund-payment__err"
                                error
                              >
                                {getErrorMessage(errors, "transactionId")}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                  <div 
                    className={`refund-method ${!shouldUsePrevPaymentMethod ? "refund-method--active" : ""}`}
                  >
                    <FormControlLabel
                      className="radio-label"
                      label="Refund by Cheque"
                      value={false}
                      control={
                        <Radio 
                          key="refund-by-cheque"
                        />
                      }
                    />
                  </div>
                </RadioGroup>
              )}
            />
          </FormProvider>
        </div>
        <div className="void-info void-info--fee-summary">
          <div className="header">
            <div className="header__title">
              {permitTypeDisplayText(permit?.permitType)}
            </div>
            <div className="header__permit-number">
              <span>Voiding Permit #: </span>
              <span 
                data-testid="voiding-permit-number"
              >
                {permit?.permitNumber}
              </span>
            </div>
          </div>
          <FeeSummary
            permitType={permit?.permitType}
            permitDuration={permit?.permitData?.permitDuration}
            feeSummary={permit?.permitData?.feeSummary}
          />
          <div className="footer">
            <Button 
              className="finish-btn"
              variant="contained"
              color="primary"
              onClick={handleSubmit(handleFinish)}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
