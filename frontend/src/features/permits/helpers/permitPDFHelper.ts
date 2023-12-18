import {
  downloadPermitApplicationPdf,
  downloadReceiptPdf,
} from "../apiManager/permitsAPI";

/**
 * Opens the PDF in a new browser tab.
 * NOTE: Only supports PDFs.
 * @param blob The blob to be opened.
 */
export const openBlobInNewTab = (blob: Blob) => {
  const objUrl = URL.createObjectURL(
    new Blob([blob], { type: "application/pdf" }),
  );
  window.open(objUrl, "_blank");
};

/**
 * Opens the receipt pdf in a new tab.
 * @param permitId The permit id.
 */
export const viewReceiptPdf = async (permitId: string) => {
  if (permitId) {
    try {
      const { blobObj: blobObjWithoutType } =
        await downloadReceiptPdf(permitId);
      openBlobInNewTab(blobObjWithoutType);
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * Opens the permit PDF in a new tab.
 * @param permitId The permitId of the permit.
 */
export const viewPermitPdf = async (permitId: string) => {
  try {
    const { blobObj: blobObjWithoutType } =
      await downloadPermitApplicationPdf(permitId);
    openBlobInNewTab(blobObjWithoutType);
  } catch (err) {
    console.error(err);
  }
};
