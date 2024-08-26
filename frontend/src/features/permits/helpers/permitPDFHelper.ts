import {
  downloadPermitApplicationPdf,
  downloadReceiptPdf,
} from "../apiManager/permitsAPI";
import { useNavigate } from 'react-router-dom';

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
export const viewReceiptPdf = async (permitId: string, companyId?: string) => {
  if (permitId) {
    try {
      const { blobObj: blobObjWithoutType } = await downloadReceiptPdf(
        permitId,
        companyId,
      );
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
export const viewPermitPdf = async (
  permitId: string, 
  navigate: ReturnType<typeof useNavigate>, // Accept navigate as a parameter
  companyId?: string,
) => {
  try {
    const { blobObj: blobObjWithoutType } = await downloadPermitApplicationPdf(
      permitId,
      companyId,
    );
    openBlobInNewTab(blobObjWithoutType);
  } catch (err) {
    console.error(err);
    navigate('/document-on-the-way');
  }
};
