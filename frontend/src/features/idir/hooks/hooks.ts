/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { createOnRouteBCProfile } from "../../manageProfile/apiManager/manageProfileAPI";
import { CompanyProfile } from "../../manageProfile/types/manageProfile";
import { Dispatch, SetStateAction, useContext } from "react";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { Nullable } from "../../../common/types/common";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { ERROR_ROUTES } from "../../../routes/constants";

export const createProfileMutation = (
  setClientNumber: Dispatch<SetStateAction<Nullable<string>>>,
) => {
  const { setCompanyId, setCompanyLegalName, setOnRouteBCClientNumber } =
    useContext(OnRouteBCContext);

  const navigate = useNavigate();

  return useMutation({
    mutationFn: createOnRouteBCProfile,
    onSuccess: async (response) => {
      if (response.status === 200 || response.status === 201) {
        const { companyId, clientNumber, legalName } =
          response.data as CompanyProfile;

        // Handle context updates;
        setCompanyId?.(companyId);
        setCompanyLegalName?.(legalName);
        setOnRouteBCClientNumber?.(clientNumber);
        setClientNumber(clientNumber);
        // By default a newly created company shouldn't be suspended, so no need for setIsCompanySuspended

        // Setting the companyId in the sessionStorage so that it can be used
        // used outside of react components;
        sessionStorage.setItem(
          "onRouteBC.user.companyId",
          companyId.toString(),
        );
      }
    },
    onError: (error: AxiosError) => {
      navigate(ERROR_ROUTES.UNEXPECTED, {
        state: { correlationId: error.response?.headers["x-correlation-id"] },
      });
    },
  });
};

// export const createProfileMutation = (
//   setClientNumber: Dispatch<SetStateAction<Nullable<string>>>,
// ) => {
//   const { setCompanyId, setCompanyLegalName, setOnRouteBCClientNumber } =
//     useContext(OnRouteBCContext);

//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: createOnRouteBCProfile,
//     onSuccess: async (response) => {
//       if (response.status === 200 || response.status === 201) {
//         const { companyId, clientNumber, legalName } =
//           response.data as CompanyProfile;
//         // Handle context updates;
//         sessionStorage.setItem(
//           "onRouteBC.user.companyId",
//           companyId.toString(),
//         );
//         setCompanyId?.(() => companyId);
//         setCompanyLegalName?.(() => legalName);
//         setOnRouteBCClientNumber?.(() => clientNumber);
//         // By default a newly created company shouldn't be suspended, so no need for setIsCompanySuspended
//         setClientNumber(() => clientNumber);
//       }
//     },
//     onError: (error: AxiosError) => {
//       navigate(ERROR_ROUTES.UNEXPECTED, {
//         state: { correlationId: error.response?.headers["x-correlation-id"] },
//       });
//     },
//   });
// };
