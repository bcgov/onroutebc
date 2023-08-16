import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import { downloadReceiptPdf } from "../../apiManager/permitsAPI";
import { openBlobInNewTab } from "../../helpers/openPdfInNewTab";

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
   * Opens the receipt pdf in a new tab.
   * @param permitId The permit id.
   */
  const viewReceiptPdf = async (permitId: string) => {
    if (permitId) {
      try {
        const { blobObj: blobObjWithoutType } = await downloadReceiptPdf(
          permitId
        );
        openBlobInNewTab(blobObjWithoutType);
      } catch (err) {
        console.error(err);
      }
    }
  };

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
