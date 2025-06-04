import "./AmendOrVoidFeeSummary.scss";
import { feeSummaryDisplayText } from "../../helpers/feeSummary";

export const AmendOrVoidFeeSummary = ({
  currentPermitValue,
  newPermitValue,
  amountToRefund,
}: {
  currentPermitValue: string;
  newPermitValue: string;
  amountToRefund: string;
}) => {
  currentPermitValue = feeSummaryDisplayText(currentPermitValue);
  amountToRefund = feeSummaryDisplayText(amountToRefund);
  newPermitValue = feeSummaryDisplayText(newPermitValue);

  return (
    <div className="amend-or-void-fee-summary">
      <div className="amend-or-void-fee-summary__title">Fee Summary</div>
      <div className="amend-or-void-fee-summary__table">
        <div className="table-row table-row--header">
          <div className="table-row__th">Description</div>
          <div className="table-row__th">Amount</div>
        </div>

        <div className="table-row">
          <div className="table-row__td">Current Permit Value</div>

          <div className="table-row__td">{currentPermitValue}</div>
        </div>

        <div className="table-row">
          <div className="table-row__td">New Permit Value</div>

          <div className="table-row__td">{newPermitValue}</div>
        </div>

        <div className="table-row table-row--total">
          <div className="table-row__tf">Total (CAD)</div>
          <div className="table-row__tf">{amountToRefund}</div>
        </div>
      </div>
    </div>
  );
};
