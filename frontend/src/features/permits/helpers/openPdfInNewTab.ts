/**
 * Opens the PDF in a new browser tab.
 * NOTE: Only supports PDFs.
 * @param blob The blob to be opened.
 */
export const openBlobInNewTab = (blob: Blob) => {
  const objUrl = URL.createObjectURL(
    new Blob([blob], { type: "application/pdf" })
  );
  window.open(objUrl, "_blank");
};
