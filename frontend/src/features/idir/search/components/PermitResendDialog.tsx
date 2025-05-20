import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormHelperText,
} from "@mui/material";

import "./PermitResendDialog.scss";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { Optional, ORBC_FORM_FEATURES } from "../../../../common/types/common";
import {
  requiredMessage,
  selectionRequired,
} from "../../../../common/helpers/validationMessages";

import {
  CustomFormComponent,
  getErrorMessage,
} from "../../../../common/components/form/CustomFormComponents";

import {
  EMAIL_NOTIFICATION_TYPES,
  EmailNotificationType,
} from "../../../permits/types/EmailNotificationType";
import { usePermitDetailsQuery } from "../../../permits/hooks/hooks";

interface PermitResendFormData {
  permitId: string;
  email: string;
  notificationTypes: {
    EMAIL_PERMIT: boolean;
    EMAIL_RECEIPT: boolean;
  };
}

const FEATURE = ORBC_FORM_FEATURES.PERMIT_RESEND;

const notificationTypesRules = {
  validate: {
    requiredSelection: (
      value: Optional<{
        EMAIL_PERMIT: boolean;
        EMAIL_RECEIPT: boolean;
      }>,
    ) => {
      return value?.EMAIL_PERMIT || value?.EMAIL_RECEIPT || selectionRequired();
    },
  },
};

/**
 *  A dialog box for resending permit by email.
 */
export default function PermitResendDialog({
  shouldOpen,
  onResend,
  onCancel,
  companyId,
  permitId,
  permitNumber,
}: Readonly<{
  shouldOpen: boolean;
  onResend: (
    permitId: string,
    email: string,
    notificationTypes: EmailNotificationType[],
  ) => Promise<void>;
  onCancel: () => void;
  companyId: number;
  permitId: string;
  permitNumber: string;
}>) {
  const { data: permit } = usePermitDetailsQuery(
    companyId,
    permitId,
    // only make request when dialog is open, preventing multiple requests being made when permit search results are rendered
    shouldOpen,
  );

  const additionalEmail = permit?.permitData.contactDetails.additionalEmail;

  const [notificationTypes, setNotificationTypes] = useState({
    EMAIL_PERMIT: false,
    EMAIL_RECEIPT: false,
  });

  const formMethods = useForm<PermitResendFormData>({
    defaultValues: {
      permitId,
      email: getDefaultRequiredVal("", additionalEmail),
      notificationTypes,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    clearErrors,
  } = formMethods;

  useEffect(() => {
    setValue("notificationTypes", notificationTypes);
    if (notificationTypes.EMAIL_PERMIT || notificationTypes.EMAIL_RECEIPT) {
      clearErrors();
    }
  }, [notificationTypes]);

  useEffect(() => {
    additionalEmail && setValue("email", additionalEmail);
  }, [additionalEmail]);

  const handleCancel = () => {
    onCancel();
  };

  const handleResend = (formData: PermitResendFormData) => {
    const { permitId, email, notificationTypes } = formData;
    const selectedNotificationTypes = Object.keys(notificationTypes).filter(
      (type) => notificationTypes[type as EmailNotificationType],
    ) as EmailNotificationType[];

    onResend(permitId, email, selectedNotificationTypes);
  };

  const toggleNotificationType = (type: EmailNotificationType) => {
    setNotificationTypes({
      EMAIL_PERMIT:
        type === EMAIL_NOTIFICATION_TYPES.PERMIT
          ? !notificationTypes.EMAIL_PERMIT
          : notificationTypes.EMAIL_PERMIT,
      EMAIL_RECEIPT:
        type === EMAIL_NOTIFICATION_TYPES.RECEIPT
          ? !notificationTypes.EMAIL_RECEIPT
          : notificationTypes.EMAIL_RECEIPT,
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Dialog
        className="permit-resend-dialog"
        onClose={handleCancel}
        aria-labelledby="confirmation-dialog-title"
        open={shouldOpen}
      >
        <div className="permit-resend-dialog__header">
          <div className="permit-resend-dialog__icon">
            <FontAwesomeIcon className="icon" icon={faEnvelope} />
          </div>

          <span className="permit-resend-dialog__title">
            Resend Permit and Receipt
          </span>
        </div>

        <div className="permit-resend-info">
          <span className="permit-resend-info__permit-number">
            Permit #: {permitNumber}
          </span>

          <Controller
            name="notificationTypes"
            control={control}
            rules={notificationTypesRules}
            render={({ fieldState: { invalid } }) => (
              <FormControl
                className="permit-resend-info__notification-types"
                error={invalid}
              >
                <div className="notification-type notification-type--permit">
                  <Checkbox
                    className={`notification-type__checkbox ${invalid ? "notification-type__checkbox--invalid" : ""}`}
                    checked={notificationTypes.EMAIL_PERMIT}
                    onChange={() =>
                      toggleNotificationType(EMAIL_NOTIFICATION_TYPES.PERMIT)
                    }
                  />
                  <div className="notification-type__label">Permit</div>
                </div>

                <div className="notification-type notification-type--receipt">
                  <Checkbox
                    className={`notification-type__checkbox ${invalid ? "notification-type__checkbox--invalid" : ""}`}
                    checked={notificationTypes.EMAIL_RECEIPT}
                    onChange={() =>
                      toggleNotificationType(EMAIL_NOTIFICATION_TYPES.RECEIPT)
                    }
                  />
                  <div className="notification-type__label">Receipt</div>
                </div>

                {invalid ? (
                  <FormHelperText
                    className="permit-resend-info__error-msg"
                    error
                  >
                    {getErrorMessage(errors, "notificationTypes")}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <CustomFormComponent
            className="permit-resend-info__input permit-resend-info__input--email"
            type="input"
            feature={FEATURE}
            options={{
              name: "email",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Email",
            }}
          />
        </div>

        <div className="permit-resend-dialog__actions">
          <Button
            className="permit-resend-dialog__btn permit-resend-dialog__btn--cancel"
            variant="contained"
            color="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            className="permit-resend-dialog__btn permit-resend-dialog__btn--resend"
            variant="contained"
            color="primary"
            onClick={handleSubmit(handleResend)}
          >
            Resend
          </Button>
        </div>
      </Dialog>
    </FormProvider>
  );
}
