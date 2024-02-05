import { downloadPermitApplicationPdf } from "../../apiManager/permitsAPI";

self.onmessage = async (e) => {
  const permitId = e.data;
  try {
    const { blobObj: blobObjWithoutType } =
      await downloadPermitApplicationPdf(permitId);
    self.postMessage(blobObjWithoutType);
  } catch (err) {
    console.error(err);
  }
};

export {};