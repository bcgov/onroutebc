import { Box, Typography } from "@mui/material";

import "./ReviewContactDetails.scss";
import { ContactDetails } from "../../../../types/application";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";

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
  contactDetails,
}: {
  contactDetails?: ContactDetails,
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
          <Typography className="contact-details__detail">
            <span 
              className="contact-details__data"
              data-testid="review-contact-details-name"
            >
              {nameDisplay(
                contactDetails?.firstName,
                contactDetails?.lastName
              )}
            </span>
          </Typography>
          <Typography className="contact-details__detail">
            <span className="contact-details__label">Primary Phone:</span>
            <span 
              className="contact-details__data"
              data-testid="review-contact-details-phone1"
            >
              {phoneDisplay(
                contactDetails?.phone1, 
                contactDetails?.phone1Extension
              )}
            </span>
          </Typography>
          {contactDetails?.phone2 ? (
            <Typography className="contact-details__detail">
              <span className="contact-details__label">Alternate Phone:</span>
              <span 
                className="contact-details__data"
                data-testid="review-contact-details-phone2"
              >
                {phoneDisplay(
                  contactDetails?.phone2, 
                  contactDetails?.phone2Extension
                )}
              </span>
            </Typography>
          ) : null}
          <Typography className="contact-details__detail">
            <span className="contact-details__label">Email:</span>
            <span 
              className="contact-details__data"
              data-testid="review-contact-details-email"
            >
              {contactDetails?.email}
            </span>
          </Typography>
          {contactDetails?.fax ? (
            <Typography className="contact-details__detail">
              <span className="contact-details__label">Fax:</span>
              <span 
                className="contact-details__data"
                data-testid="review-contact-details-fax"
              >
                {phoneDisplay(
                  contactDetails?.fax
                )}
              </span>
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
