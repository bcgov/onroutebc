import { useQuery } from "@tanstack/react-query";
import { InfoBcGovBanner } from "../../../../common/components/banners/AlertBanners";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import { getActivePermits } from "../../apiManager/permitsAPI";
import { PermitApplicationInProgress } from "../../types/application";
import { BlankPermitList } from "./BlankPermitList";

/**
 * A wrapper with the query to load the table with active permits.
 */
export const ActivePermitList = () => {
  const query = useQuery({
    queryKey: ["activePermits"],
    queryFn: getActivePermits,
    keepPreviousData: true,
    staleTime: FIVE_MINUTES,
  });

  const dd: PermitApplicationInProgress[] = [
    {
      permitId: "4",
      permitStatus: "ISSUED",
      companyId: 103,
      userGuid: "EB1CA523856F4E7C92F7322C0194CA3E",
      permitType: "TROS",
      applicationNumber: "A2-00010006-582-R00",
      permitNumber: "P2-00010006-582-R00",
      permitApprovalSource: null,
      permitApplicationOrigin: "ONLINE",
      createdDateTime: "2023-07-25T17:57:48.969Z",
      updatedDateTime: "2023-07-25T17:57:48.969Z",
      documentId: null,
      permitData: {
        startDate: "2023-07-25",
        permitDuration: 30,
        expiryDate: "2023-08-23",
        commodities: [
          {
            description: "General Permit Conditions",
            condition: "CVSE-1000",
            conditionLink:
              "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251",
            checked: true,
            disabled: true,
          },
          {
            description: "Permit Scope and Limitation",
            condition: "CVSE-1070",
            conditionLink:
              "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
            checked: true,
            disabled: true,
          },
        ],
        contactDetails: {
          firstName: "Terran",
          lastName: "Wilkie",
          phone1: "(250) 634-3419",
          email: "terran.wilkie@gov.bc.ca",
        },
        mailingAddress: {
          addressLine1: "1445 Fort Street",
          city: "Victoria",
          provinceCode: "BC",
          countryCode: "CA",
          postalCode: "V8S1Z4",
        },
        vehicleDetails: {
          unitNumber: "K344",
          vin: "CYZ128437ZYX",
          plate: "N8769N",
          make: "BMW",
          year: 0,
          countryCode: "CA",
          provinceCode: "BC",
          vehicleType: "TRUCK",
          vehicleSubType: "TOW",
          saveVehicle: false,
        },
        feeSummary: "30",
      },
    },
    {
      permitId: "5",
      permitStatus: "ISSUED",
      companyId: 103,
      userGuid: "EB1CA523856F4E7C92F7322C0194CA3E",
      permitType: "TROS",
      applicationNumber: "A2-00010006-582-R00",
      permitNumber: "P3-00010006-582-R00",
      permitApprovalSource: null,
      permitApplicationOrigin: "ONLINE",
      createdDateTime: "2023-07-25T17:57:48.969Z",
      updatedDateTime: "2023-07-25T17:57:48.969Z",
      documentId: null,
      permitData: {
        startDate: "2023-06-25",
        permitDuration: 30,
        expiryDate: "2023-07-30",
        commodities: [
          {
            description: "General Permit Conditions",
            condition: "CVSE-1000",
            conditionLink:
              "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251",
            checked: true,
            disabled: true,
          },
          {
            description: "Permit Scope and Limitation",
            condition: "CVSE-1070",
            conditionLink:
              "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
            checked: true,
            disabled: true,
          },
        ],
        contactDetails: {
          firstName: "Terran",
          lastName: "Wilkie",
          phone1: "(250) 634-3419",
          email: "terran.wilkie@gov.bc.ca",
        },
        mailingAddress: {
          addressLine1: "1445 Fort Street",
          city: "Victoria",
          provinceCode: "BC",
          countryCode: "CA",
          postalCode: "V8S1Z4",
        },
        vehicleDetails: {
          unitNumber: "U9899",
          vin: "CYZ128437ZYX",
          plate: "N8769N",
          make: "BMW",
          year: 0,
          countryCode: "CA",
          provinceCode: "BC",
          vehicleType: "TRUCK",
          vehicleSubType: "TOW",
          saveVehicle: false,
        },
        feeSummary: "30",
      },
    },
  ];

  return (
    <div className="table-container">
      <InfoBcGovBanner description="Refunds and amendments can be requested over the phone by calling the Provincial Permit Centre at Toll-free: 1-800-559-9688. Please have your permit number ready." />
      <BlankPermitList query={query} />
    </div>
  );
};

ActivePermitList.displayName = "ActivePermitList";
