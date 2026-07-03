import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";

import "./ICBCInsuranceCertificateSection.scss";
import { ORBCFormFeatureType } from "../../../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { InfoBcGovBanner } from "../../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../../common/constants/bannerMessages";
import { CustomFormComponent } from "../../../../../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../../../../../common/helpers/validationMessages";

export const ICBCInsuranceCertificateSection = ({
  feature,
  permitType,
  haveCertificate,
  onSetHaveCertificate,
}: {
  feature: ORBCFormFeatureType;
  permitType: PermitType;
  haveCertificate: boolean;
  onSetHaveCertificate: (updatedHaveCertificate: boolean) => void;
}) => {
  const showSection = permitType === PERMIT_TYPES.HC;
  
  return showSection ? (
    <Box className="icbc-insurance-certificate-section">
      <Box className="icbc-insurance-certificate-section__header">
        <h3>ICBC Certificate of Insurance</h3>
      </Box>

      <Box className="icbc-insurance-certificate-section__body">
        <InfoBcGovBanner
          className="icbc-insurance-certificate-section__info-banner"
          msg={BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.TITLE}
          additionalInfo={
            <div className="certificate-info">
              <p className="certificate-info__section certificate-info__section--first">
                {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.SELECT_NO_MSG.START}
                <span className="certificate-info__highlighted-text">
                  {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.SELECT_NO_MSG.NO}
                </span>
                {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.SELECT_NO_MSG.END}
              </p>

              <p className="certificate-info__section">
                {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.CONTACT.START}
                <span className="certificate-info__highlighted-text">
                  {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.CONTACT.TOLL_FREE}
                </span>
                {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.CONTACT.OR}
                <span className="certificate-info__highlighted-text">
                  {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.CONTACT.EMAIL}
                </span>
              </p>

              <p className="certificate-info__section">
                {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.SELECT_YES_MSG.START}
                <span className="certificate-info__highlighted-text">
                  {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.SELECT_YES_MSG.YES}
                </span>
                {BANNER_MESSAGES.ICBC_INSURANCE_CERTIFICATE.SELECT_YES_MSG.END}
              </p>
            </div>
          }
        />

        <Box className="icbc-insurance-certificate-section__have-certificate">
          <h4 className="icbc-insurance-certificate-section__have-certificate-header">
            Do you have an ICBC Certificate of Insurance for Crossing Permit (MV1805/APV36)?
          </h4>

          <RadioGroup
            className="icbc-insurance-certificate-section__radio-group"
            defaultValue={haveCertificate}
            value={haveCertificate}
            onChange={(e) =>
              onSetHaveCertificate(e.target.value === "true")
            }
          >
            <FormControlLabel
              key="have-certificate-no"
              className="have-certificate have-certificate--no"
              classes={{
                label: "have-certificate__label",
              }}
              label="No"
              value={false}
              control={
                <Radio
                  key="have-certificate-radio-no"
                  className="have-certificate__radio"
                />}
            />

            <FormControlLabel
              key="have-certificate-yes"
              className="have-certificate have-certificate--yes"
              classes={{
                label: "have-certificate__label",
              }}
              label="Yes"
              value={true}
              control={
                <Radio
                  key="have-certificate-radio-yes"
                  className="have-certificate__radio"
                />}
            />
          </RadioGroup>
        </Box>

        {haveCertificate ? (
          <CustomFormComponent
            className="icbc-insurance-certificate-section__input"
            type="input"
            feature={feature}
            options={{
              name: "permitData.icbcInsuranceCertificate.certificateNumber",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Certificate No.",
            }}
          />
        ) : null}
      </Box>
    </Box>
  ) : null;
};
