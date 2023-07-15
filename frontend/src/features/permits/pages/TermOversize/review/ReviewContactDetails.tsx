import { Box, Typography } from "@mui/material";
import "./ReviewContactDetails.scss";
import { Application } from "../../../types/application";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";

const nameDisplay = (firstName?: string, lastName?: string) => {
  if (!firstName) return getDefaultRequiredVal("", lastName);
  if (!lastName) return getDefaultRequiredVal("", firstName);
  return `${firstName} ${lastName}`;
};

const phoneDisplay = (phone?: string, ext?: string) => {
  if (!phone) return "";
  const firstPart = `${phone}`;
  const secondPart = getDefaultRequiredVal("", ext).trim() !== "" ? 
    `Ext: ${ext}` : "";
  return `${firstPart} ${secondPart}`;
};

export const ReviewContactDetails = ({
  values,
}: {
  values: Application | undefined;
}) => {
  return (
    <Box className="review-contact-details">
      <Box className="review-contact-details__header">
        <Typography 
          variant={"h3"}
          className="review-contact-details__title"
          data-testid="review-contact-details-title"
        >
          Contact Information
        </Typography>
      </Box>
      <Box className="review-contact-details__body">
        <Box className="contact-details">
          <Typography>
            <span 
              className="contact-details__data"
              data-testid="review-contact-details-name"
            >
              {nameDisplay(
                values?.permitData?.contactDetails?.firstName,
                values?.permitData?.contactDetails?.lastName
              )}
            </span>
          </Typography>
          <Typography>
            <span className="contact-details__label">Primary Phone:</span>
            <span 
              className="contact-details__data"
              data-testid="review-contact-details-phone1"
            >
              {phoneDisplay(
                values?.permitData.contactDetails?.phone1, 
                values?.permitData.contactDetails?.phone1Extension
              )}
            </span>
          </Typography>
          {values?.permitData.contactDetails?.phone2 ? (
            <Typography>
              <span className="contact-details__label">Alternate Phone:</span>
              <span 
                className="contact-details__data"
                data-testid="review-contact-details-phone2"
              >
                {phoneDisplay(
                  values?.permitData.contactDetails?.phone2, 
                  values?.permitData.contactDetails?.phone2Extension
                )}
              </span>
            </Typography>
          ) : null}
          <Typography>
            <span className="contact-details__label">Email:</span>
            <span 
              className="contact-details__data"
              data-testid="review-contact-details-email"
            >
              {values?.permitData.contactDetails?.email}
            </span>
          </Typography>
          {values?.permitData?.contactDetails?.fax ? (
            <Typography>
              <span className="contact-details__label">Fax:</span>
              <span 
                className="contact-details__data"
                data-testid="review-contact-details-fax"
              >
                {phoneDisplay(
                  values?.permitData.contactDetails?.fax
                )}
              </span>
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
