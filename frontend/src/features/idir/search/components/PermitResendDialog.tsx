import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Dialog, FormControl, FormHelperText } from "@mui/material";

import "./PermitResendDialog.scss";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { requiredMessage, selectionRequired } from "../../../../common/helpers/validationMessages";
import { CustomFormComponent, getErrorMessage } from "../../../../common/components/form/CustomFormComponents";
import { EMAIL_NOTIFICATION_TYPES, EmailNotificationType } from "../../../permits/types/EmailNotificationType";
import { Optional } from "../../../../common/types/common";

interface PermitResendFormData {
  permitId: string;
  email: string;
  notificationTypes: EmailNotificationType[];
}

const FEATURE = "permit-resend";

const notificationTypesRules = {
  validate: {
    requiredSelection: (
      value: Optional<EmailNotificationType[]>,
    ) => {
      return (
        getDefaultRequiredVal(0, value?.length) > 0 ||
        selectionRequired()
      );
    },
  },
};

/**
 *  A dialog box for resending permit by email or fax.
 */
export default function PermitResendDialog({
  shouldOpen,
  onResend,
  onCancel,
  permitId,
  permitNumber,
  email,
}: Readonly<{
  shouldOpen: boolean;
  onResend: (
    permitId: string,
    email: string,
    notificationTypes: EmailNotificationType[],
  ) => Promise<void>;
  onCancel: () => void;
  permitId: string;
  permitNumber: string;
  email?: string;
}>) {
  const [notificationTypes, setNotificationTypes] = useState([
    { type: EMAIL_NOTIFICATION_TYPES.PERMIT, checked: false },
    { type: EMAIL_NOTIFICATION_TYPES.RECEIPT, checked: false },
  ]);

  const selectedNotificationTypes = () => notificationTypes
    .filter(notificationType => notificationType.checked)
    .map(notificationType => notificationType.type);

  const isNotificationTypeSelected = (type: EmailNotificationType) => {
    const notificationTypeState = notificationTypes
      .find(notificationType => notificationType.type === type);
    
    return Boolean(notificationTypeState?.checked);
  };

  const formMethods = useForm<PermitResendFormData>({
    defaultValues: {
      permitId,
      email: getDefaultRequiredVal("", email),
      notificationTypes: selectedNotificationTypes(),
    },
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
    const selectedTypes = selectedNotificationTypes();
    setValue("notificationTypes", selectedTypes);
    if (selectedTypes.length > 0) {
      clearErrors();
    }
  }, [notificationTypes]);

  const handleCancel = () => {
    onCancel();
  };

  const handleResend = (formData: PermitResendFormData) => {
    const { permitId, email, notificationTypes } = formData;
    onResend(permitId, email, notificationTypes);
  };

  const toggleNotificationType = (type: EmailNotificationType) => {
    setNotificationTypes(notificationTypes.map(notificationType => ({
      ...notificationType,
      checked: notificationType.type === type ?
        !notificationType.checked : notificationType.checked,
    })));
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
            <FontAwesomeIcon
              className="icon"
              icon={faEnvelope}
            />
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
            render={({
              fieldState: { invalid },
            }) => (
              <FormControl
                className="permit-resend-info__notification-types"
                error={invalid}
              >
                <div className="notification-type notification-type--permit">
                  <Checkbox
                    className={`notification-type__checkbox ${invalid ? "notification-type__checkbox--invalid" : ""}`}
                    checked={isNotificationTypeSelected(EMAIL_NOTIFICATION_TYPES.PERMIT)}
                    onChange={() => toggleNotificationType(EMAIL_NOTIFICATION_TYPES.PERMIT)}
                  />
                  <div className="notification-type__label">Permit</div>
                </div>

                <div className="notification-type notification-type--receipt">
                  <Checkbox
                    className={`notification-type__checkbox ${invalid ? "notification-type__checkbox--invalid" : ""}`}
                    checked={isNotificationTypeSelected(EMAIL_NOTIFICATION_TYPES.RECEIPT)}
                    onChange={() => toggleNotificationType(EMAIL_NOTIFICATION_TYPES.RECEIPT)}
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
