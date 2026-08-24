import "./AxleSpacingAndWeightsResults.scss";

import { ErrorAltBcGovBanner } from "../../../../../../../../common/components/banners/ErrorAltBcGovBanner";
import { CustomExternalLink } from "../../../../../../../../common/components/links/CustomExternalLink";
import { formatNumberWithCommas } from "../../../../../../../../common/helpers/formatNumberWithCommas";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import {
  CTPM_CHAPTER_5_TITLE,
  ONROUTE_WEBPAGE_LINKS,
} from "../../../../../../../../routes/constants";
import {
  AxleCalculationResult,
  POLICY_CHECK_RESULT_TYPES,
  PolicyCheckIdType,
} from "../../../../../../types/AxleCalculationResult";
import { DISPLAYABLE_POLICY_CHECK_IDS } from "./displayablePolicyCheckIds";
import { OverloadCalculationDetails } from "./OverloadCalculationDetails";
import { PermitNotRequiredBanner } from "./PermitNotRequiredBanner";
import { WarningBanner } from "./WarningBanner";

export const AxleSpacingAndWeightsResults = ({
  axleCalculationResults,
  showValidationBanner,
}: {
  axleCalculationResults?: AxleCalculationResult;
  showValidationBanner: boolean;
}) => {
  if (!showValidationBanner && !axleCalculationResults) return null;

  const failedResults = axleCalculationResults?.results.filter(
    (result) =>
      result.result === POLICY_CHECK_RESULT_TYPES.FAIL &&
      DISPLAYABLE_POLICY_CHECK_IDS.has(result.id as PolicyCheckIdType),
  );
  const warningResults = axleCalculationResults?.results.filter(
    (result) =>
      result.result === POLICY_CHECK_RESULT_TYPES.WARNING &&
      DISPLAYABLE_POLICY_CHECK_IDS.has(result.id as PolicyCheckIdType),
  );
  const hasFailures = Boolean(failedResults?.length);
  const hasWarnings = Boolean(warningResults?.length);
  const totalGCVW = axleCalculationResults?.totalGCVW;
  const overload = axleCalculationResults?.overload;
  const showPermitNotRequiredBanner = !hasFailures && overload === 0;
  const isReferencingCTPMChapter5 = (message: string) =>
    message.toLowerCase().includes(CTPM_CHAPTER_5_TITLE.toLowerCase());

  return (
    <div className="axle-spacing-and-weights-results">
      {showValidationBanner ? (
        <ErrorAltBcGovBanner msg="All fields in Axle Spacing and Weights are required to calculate results." />
      ) : (
        <div className="axle-spacing-and-weights-results__list">
          {totalGCVW && !Number.isNaN(totalGCVW) ? (
            <span className="axle-spacing-and-weights-results__item">
              <strong>Total GCVW (kg):</strong>{" "}
              {formatNumberWithCommas(totalGCVW)}
            </span>
          ) : null}
          {overload !== undefined &&
          overload > 0 &&
          axleCalculationResults?.overloadDetails?.length ? (
            <OverloadCalculationDetails
              overload={overload}
              details={axleCalculationResults.overloadDetails}
            />
          ) : overload !== undefined && overload >= 0 ? (
            <span className="axle-spacing-and-weights-results__item">
              <strong>Overload (kg):</strong> {formatNumberWithCommas(overload)}
            </span>
          ) : null}
          <span className="axle-spacing-and-weights-results__item">
            <strong>Violation(s): </strong>
            {hasFailures
              ? getDefaultRequiredVal([], failedResults).map(
                  (failedResult, index) => (
                    <div key={`axle-calc-fail-${index}`}>
                      {isReferencingCTPMChapter5(failedResult.message) ? (
                        <p className="axle-spacing-and-weights-results__text axle-spacing-and-weights-results__text--fail">
                          {failedResult.message.replace(
                            CTPM_CHAPTER_5_TITLE,
                            "",
                          )}
                          <CustomExternalLink
                            href={ONROUTE_WEBPAGE_LINKS.CTPM_CHAPTER_5}
                            className="warning-banner__text--link"
                            openInNewTab={true}
                          >
                            {CTPM_CHAPTER_5_TITLE}
                          </CustomExternalLink>
                        </p>
                      ) : (
                        <p className="axle-spacing-and-weights-results__text axle-spacing-and-weights-results__text--fail">
                          {failedResult.message}
                        </p>
                      )}
                    </div>
                  ),
                )
              : "None"}
          </span>
          {hasWarnings ? (
            getDefaultRequiredVal([], warningResults).map(
              (warningResult, index) => (
                <WarningBanner
                  key={index}
                  content={
                    isReferencingCTPMChapter5(warningResult.message) ? (
                      <>
                        {warningResult.message.replace(
                          CTPM_CHAPTER_5_TITLE,
                          "",
                        )}
                        <CustomExternalLink
                          href={ONROUTE_WEBPAGE_LINKS.CTPM_CHAPTER_5}
                          openInNewTab={true}
                        >
                          {CTPM_CHAPTER_5_TITLE}
                        </CustomExternalLink>
                      </>
                    ) : (
                      <>{warningResult.message}</>
                    )
                  }
                />
              ),
            )
          ) : showPermitNotRequiredBanner ? (
            <>
              <p className="axle-spacing-and-weights-results__text axle-spacing-and-weights-results__text--success">
                This permit type is not required.
              </p>
              <PermitNotRequiredBanner />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};
