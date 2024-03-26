import { FormProvider, useForm } from "react-hook-form";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog } from "@mui/material";

import "./PermitResendDialog.scss";
import { Nullable } from "../../../../common/types/common";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";

interface PermitResendFormData {
  permitId: string;
  email: string;
  fax?: Nullable<string>;
}

const FEATURE = "permit-resend";

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
  fax,
}: Readonly<{
  shouldOpen: boolean;
  onResend: (
    permitId: string,
    email: string,
    fax?: Nullable<string>,
  ) => Promise<void>;
  onCancel: () => void;
  permitId: string;
  permitNumber: string;
  email?: string;
  fax?: string;
}>) {
  const formMethods = useForm<PermitResendFormData>({
    defaultValues: {
      permitId,
      email: getDefaultRequiredVal("", email),
      fax: getDefaultRequiredVal("", fax),
    },
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  const handleCancel = () => {
    onCancel();
  };

  const handleResend = (formData: PermitResendFormData) => {
    const { permitId, email, fax } = formData;
    onResend(permitId, email, fax);
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

          <CustomFormComponent
            className="permit-resend-info__input permit-resend-info__input--fax"
            type="phone"
            feature={FEATURE}
            options={{
              name: "fax",
              rules: {
                required: false,
              },
              label: "Fax",
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
