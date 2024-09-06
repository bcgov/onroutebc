import { Permit } from "src/modules/permit-application-payment/permit/entities/permit.entity";
import { PolicyApplication } from "../interface/policy-application.interface";

export const convertToPolicyApplication = (
    application: Permit
  ): PolicyApplication => {
    return {
      permitType: application.permitType,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      permitData: JSON.parse(application.permitData.permitData),
    };
  };
  