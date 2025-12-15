import { CustomExternalLink } from "../../../../../../common/components/links/CustomExternalLink";
import { CONDITIONAL_LICENSING_FEE_LINKS } from "../../../../constants/constants";
import {
  CONDITIONAL_LICENSING_FEE_TYPES,
  ConditionalLicensingFeeType,
} from "../../../../types/ConditionalLicensingFee";

const clfLabelText = (clf: ConditionalLicensingFeeType) => {
  switch (clf) {
    case CONDITIONAL_LICENSING_FEE_TYPES.CONDITIONAL_LICENSING_FEE_RATE:
      return "Conditional license fee rate in accordance with";
    case CONDITIONAL_LICENSING_FEE_TYPES.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE:
      return "Industrial (X-Plate Type) fee rate in accordance with";
    case CONDITIONAL_LICENSING_FEE_TYPES.FARM_VEHICLE_FEE_RATE:
      return "Farm Vehicle fee rate in accordance with";
    case CONDITIONAL_LICENSING_FEE_TYPES.FARM_TRACTOR_FEE_RATE:
      return "Farm Tractor fee rate in accordance with";
    case CONDITIONAL_LICENSING_FEE_TYPES.COMMERCIAL_PASSENGER_VEHICLE_FEE_RATE:
      return "Commercial Passenger Vehicle rate in accordance with";
    case CONDITIONAL_LICENSING_FEE_TYPES.NONE:
    default:
      return "None";
  }
};

const clfLink = (clf: ConditionalLicensingFeeType) => {
  switch (clf) {
    case CONDITIONAL_LICENSING_FEE_TYPES.CONDITIONAL_LICENSING_FEE_RATE:
      return {
        link: CONDITIONAL_LICENSING_FEE_LINKS.CONDITIONAL_LICENSING_FEE_RATE.URL,
        text: CONDITIONAL_LICENSING_FEE_LINKS.CONDITIONAL_LICENSING_FEE_RATE.LINK_TEXT,
      };
    case CONDITIONAL_LICENSING_FEE_TYPES.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE:
      return {
        link: CONDITIONAL_LICENSING_FEE_LINKS.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE.URL,
        text: CONDITIONAL_LICENSING_FEE_LINKS.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE.LINK_TEXT,
      };
    case CONDITIONAL_LICENSING_FEE_TYPES.FARM_VEHICLE_FEE_RATE:
      return {
        link: CONDITIONAL_LICENSING_FEE_LINKS.FARM_VEHICLE_FEE_RATE.URL,
        text: CONDITIONAL_LICENSING_FEE_LINKS.FARM_VEHICLE_FEE_RATE.LINK_TEXT,
      };
    case CONDITIONAL_LICENSING_FEE_TYPES.FARM_TRACTOR_FEE_RATE:
      return {
        link: CONDITIONAL_LICENSING_FEE_LINKS.FARM_TRACTOR_FEE_RATE.URL,
        text: CONDITIONAL_LICENSING_FEE_LINKS.FARM_TRACTOR_FEE_RATE.LINK_TEXT,
      };
    case CONDITIONAL_LICENSING_FEE_TYPES.COMMERCIAL_PASSENGER_VEHICLE_FEE_RATE:
      return {
        link: CONDITIONAL_LICENSING_FEE_LINKS.COMMERCIAL_PASSENGER_VEHICLE_FEE_RATE.URL,
        text: CONDITIONAL_LICENSING_FEE_LINKS.COMMERCIAL_PASSENGER_VEHICLE_FEE_RATE.LINK_TEXT,
      };
    case CONDITIONAL_LICENSING_FEE_TYPES.NONE:
    default:
      return null;
  }
};

export const ConditionalLicensingFeeLabel = ({
  clf,
  classes,
}: {
  clf: ConditionalLicensingFeeType;
  classes?: {
    label?: string;
    link?: string;
  };
}) => {
  const link = clfLink(clf);

  return (
    <>
      <span className={classes?.label}>
        {clfLabelText(clf)}
      </span>

      {link ? (
        <CustomExternalLink
          href={link.link}
          className={classes?.link}
          data-testid={`conditional-licensing-fee-link-${clf}`}
          withLinkIcon={true}
        >
          {link.text}
        </CustomExternalLink>
      ) : null}
    </>
  );
};
