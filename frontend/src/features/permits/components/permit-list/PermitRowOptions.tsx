import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import { viewReceiptPdf } from "../../helpers/permitPDFHelper";

const ACTIVE_OPTIONS = ["View Receipt"];
const EXPIRED_OPTIONS = ["View Receipt"];

const getOptions = (isExpired: boolean): string[] => {
  if (isExpired) {
    return EXPIRED_OPTIONS;
  }
  return ACTIVE_OPTIONS;
};

export const PermitRowOptions = ({
  isExpired,
  permitId,
}: {
  isExpired: boolean;
  permitId: number;
}) => {

  /**
   * Action handler upon a select event.
   * @param selectedOption The option that was selected.
   */
  const onSelectOptionCallback = (selectedOption: string) => {
    if (selectedOption === "View Receipt") {
      viewReceiptPdf(permitId.toString());
    }
  };

  return (
    <>
      <OnRouteBCTableRowActions
        onSelectOption={onSelectOptionCallback}
        options={getOptions(isExpired)}
      />
    </>
  );
};
