import { feeSummaryDisplayText, permitTypeDisplayText } from "../../../helpers/mappers";
import "./FeeSummary.scss";

export const FeeSummary = ({
  permitType,
  feeSummary,
  permitDuration,
}: {
  permitType?: string;
  feeSummary?: string;
  permitDuration?: number;
}) => {
  const feeDisplayText = feeSummaryDisplayText(
    feeSummary, 
    permitDuration
  );

  return (
    <div className="fee-summary">
      <div className="fee-summary__title">
        Fee Summary
      </div>
      <div className="fee-summary__table">
        <div className="table-row table-row--header">
          <div className="table-row__th">Description</div>
          <div className="table-row__th">Amount</div>
        </div>
        <div className="table-row">
          <div className="table-row__td">
            {permitTypeDisplayText(permitType)}
          </div>
          <div className="table-row__td">
            {feeDisplayText}
          </div>
        </div>
        <div className="table-row table-row--total">
          <div className="table-row__tf">
            Total (CAD)
          </div>
          <div className="table-row__tf">
            {feeDisplayText}
          </div>
        </div>
      </div>
    </div>
  );
};
