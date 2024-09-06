import { Permit } from "src/modules/permit-application-payment/permit/entities/permit.entity";
import { PolicyApplication } from "../interface/policy-application.interface";

export const convertToPolicyApplication = (
    application: Permit
  ): PolicyApplication => {
    return {
      permitType: application.permitType,
      permitData: JSON.parse(application.permitData.permitData) as JSON,
    };
  };
  