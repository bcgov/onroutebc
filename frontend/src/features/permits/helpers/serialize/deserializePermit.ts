import { Permit, PermitResponseData } from "../../types/permit";
import { deserializePermitVehicleConfiguration } from "./deserializePermitVehicleConfiguration";

/**
 * Deserialize a PermitResponseData object (received from backend) to a Permit object.
 * @param response PermitResponseData object received as response data from backend
 * @returns Deserialized Permit object that can be used by form fields and the front-end app
 */
export const deserializePermitResponse = (
  response: PermitResponseData,
): Permit => {
  // For the moment a Permit is essentially the same shape as the PermitResponseData, except the vehicle configuration, which must be deserialized in order to be presented correctly in the AxleSpacingsAndWeightsTable
  return {
    ...response,
    permitData: {
      ...response.permitData,
      vehicleConfiguration: deserializePermitVehicleConfiguration(
        response.permitData.vehicleConfiguration,
      ),
    },
  };
};
