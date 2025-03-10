/* eslint-disable @typescript-eslint/no-unused-vars */
import Typography from "@mui/material/Typography";
import { memo } from "react";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import {
  invalidDBALength,
  isValidOptionalString,
} from "../../../common/helpers/validationMessages";
import "./ClientInformationWizardForm.scss";
import { ContactDetailsForm } from "./ContactDetailsForm";
import { ORBC_FORM_FEATURES } from "../../../common/types/common";
import { WarningBcGovBanner } from "../../../common/components/banners/WarningBcGovBanner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";

export const ClientInformationWizardForm = memo(
  ({ showCompanyName = false }: { showCompanyName?: boolean }) => {
    const FEATURE = ORBC_FORM_FEATURES.COMPANY_INFORMATION_WIZARD;

    return (
      <div className="client-info-wizard-form">
        {showCompanyName && (
          <>
            <Typography variant="h2" gutterBottom>
              Client Name
            </Typography>
            <WarningBcGovBanner
              className="client-info-wizard-form__warning-banner"
              msg={BANNER_MESSAGES.CLIENT_NAME_MUST_BE_REGISTERED_OWNER}
            />
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "legalName",
                rules: {
                  required: true,
                  validate: {
                    validateLegalName: (legalName: string) =>
                      isValidOptionalString(legalName, {
                        maxLength: 150,
                      }) || invalidDBALength(1, 150),
                  },
                },
                label: "Client Name",
              }}
            />
          </>
        )}
        <Typography variant="h2" gutterBottom>
          Doing Business As (DBA)
        </Typography>
        <CustomFormComponent
          type="input"
          feature={FEATURE}
          options={{
            name: "alternateName",
            rules: {
              required: false,
              validate: {
                validateAlternateName: (alternateName: string) =>
                  isValidOptionalString(alternateName, { maxLength: 150 }) ||
                  invalidDBALength(1, 150),
              },
            },
            label: "DBA",
          }}
        />

        <Typography variant="h2" gutterBottom>
          Contact Details
        </Typography>
        <ContactDetailsForm feature={FEATURE} />
      </div>
    );
  },
);

ClientInformationWizardForm.displayName = "ClientInformationWizardForm";
