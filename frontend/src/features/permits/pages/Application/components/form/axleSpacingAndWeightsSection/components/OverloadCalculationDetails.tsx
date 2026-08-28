import { useId, useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverloadCalculationDetailKind } from "onroute-policy-engine/enum";
import type { OverloadCalculationDetail } from "onroute-policy-engine/types";

import "./OverloadCalculationDetails.scss";
import { InfoBcGovBanner } from "../../../../../../../../common/components/banners/InfoBcGovBanner";
import { CustomExternalLink } from "../../../../../../../../common/components/links/CustomExternalLink";
import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../../../../../common/constants/constants";
import { formatNumber } from "../../../../../../../../common/helpers/numeric/formatNumber";
import { ONROUTE_WEBPAGE_LINKS } from "../../../../../../../../routes/constants";

export const OverloadCalculationDetails = ({
  overload,
  details,
}: {
  overload: number;
  details: Array<OverloadCalculationDetail>;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const detailsId = useId();
  const isLicensedGvwCalculation =
    details[0]?.kind === OverloadCalculationDetailKind.LicensedGvw;
  const columnCount = 4;

  return (
    <section className="overload-calculation-details">
      <div className="overload-calculation-details__summary">
        <span>
          <strong>Overload (kg):</strong> {formatNumber(overload)}
        </span>
        <button
          type="button"
          className="overload-calculation-details__toggle"
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          Overload Details
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
        </button>
      </div>

      {isExpanded ? (
        <div id={detailsId} className="overload-calculation-details__content">
          <div className="overload-calculation-details__table-container">
            <table className="overload-calculation-details__table">
              <thead>
                <tr>
                  <th>Axle Unit(s)</th>
                  {isLicensedGvwCalculation ? (
                    <>
                      <th>LGVW (kg)</th>
                      <th>Total GCVW (kg)</th>
                    </>
                  ) : (
                    <>
                      <th>Actual (kg)</th>
                      <th>Legal Max. (kg)</th>
                    </>
                  )}
                  <th>Overload (kg)</th>
                </tr>
              </thead>
              <tbody>
                {details.map((detail) => (
                  <tr
                    key={`${detail.kind}-${detail.startAxleUnit}-${detail.endAxleUnit}`}
                  >
                    <td>
                      {detail.startAxleUnit === detail.endAxleUnit
                        ? detail.startAxleUnit
                        : `${detail.startAxleUnit} - ${detail.endAxleUnit}`}
                    </td>
                    {detail.kind ===
                    OverloadCalculationDetailKind.LicensedGvw ? (
                      <>
                        <td>{formatNumber(detail.licensedGVW)}</td>
                        <td>{formatNumber(detail.totalGCVW)}</td>
                      </>
                    ) : (
                      <>
                        <td>{formatNumber(detail.actualWeight)}</td>
                        <td>{formatNumber(detail.legalMaxWeight)}</td>
                      </>
                    )}
                    <td>{formatNumber(detail.overload)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    className="overload-calculation-details__total-spacer"
                    colSpan={columnCount - 1}
                  />
                  <td className="overload-calculation-details__total">
                    Total (kg): {formatNumber(overload)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <InfoBcGovBanner
            className="overload-calculation-details__info"
            msg={
              <div>
                <strong>Additional information on overload details</strong>
                <p>
                  <CustomExternalLink
                    href={
                      ONROUTE_WEBPAGE_LINKS.COMMERCIAL_TRANSPORT_REGULATIONS
                    }
                    openInNewTab={true}
                  >
                    Commercial Transport Regulations
                  </CustomExternalLink>{" "}
                  are used to determine the maximum legal weight for overload
                  amount(s).
                  <br />
                  For further assistance please contact the Provincial Permit
                  Centre at <strong>
                    Toll-free: {TOLL_FREE_NUMBER}
                  </strong> or <strong>Email: {PPC_EMAIL}</strong>
                </p>
              </div>
            }
          />
        </div>
      ) : null}
    </section>
  );
};
