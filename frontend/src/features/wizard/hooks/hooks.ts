import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOnRouteBCProfile } from "../../manageProfile/apiManager/manageProfileAPI";
import OnRouteBCContext, {
  BCeIDUserDetailContext,
} from "../../../common/authentication/OnRouteBCContext";
import { Dispatch, SetStateAction, useContext } from "react";
import { Nullable } from "../../../common/types/common";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../routes/constants";

export const createProfileMutation = (
  setClientNumber: Dispatch<SetStateAction<Nullable<string>>>,
) => {
  const {
    setCompanyId,
    setUserDetails,
    setCompanyLegalName,
    setOnRouteBCClientNumber,
    setMigratedClient,
  } = useContext(OnRouteBCContext);

  const { idirUserDetails } = useContext(OnRouteBCContext);
  const isIdir = Boolean(idirUserDetails?.userRole);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOnRouteBCProfile,
    onSuccess: async (response) => {
      if (response.status === 200 || response.status === 201) {
        const { companyId, clientNumber, legalName, adminUser } = response.data;
        const {
          firstName,
          lastName,
          userName,
          phone1,
          phone1Extension,
          phone2,
          phone2Extension,
          email,
          userRole,
        } = adminUser;

        const userDetails: BCeIDUserDetailContext = {
          firstName,
          lastName,
          userName,
          phone1,
          phone1Extension,
          phone2,
          phone2Extension,
          email,
          userRole,
        };

        // Handle context updates;
        setCompanyId?.(companyId);
        setCompanyLegalName?.(legalName);
        setOnRouteBCClientNumber?.(clientNumber);
        setClientNumber?.(clientNumber);

        /* By default a newly created company shouldn't be suspended, so no need for setIsCompanySuspended */

        /* We are not clearing isNewBCeIDUser in the context because,
         it causes a side-effect where, if cleared, the user is immediately
         redirected to the applications page.
         They should instead remain on the page and
         look at the profile created section which contains the client number. */

        /* Setting the companyId in the sessionStorage so that it can be used used outside of react components; */
        sessionStorage.setItem(
          "onRouteBC.user.companyId",
          companyId.toString(),
        );

        if (!isIdir) {
          // Set the user context
          setUserDetails?.(userDetails);
          /* Clear any state in migrated client. We no longer need this
        once the user has successfully created/claimed their company. */
          setMigratedClient?.(undefined);
          queryClient.invalidateQueries({
            queryKey: ["userContext"],
          });
        }
      }
    },
    onError: (error: AxiosError) => {
      console.error(error);
      navigate(ERROR_ROUTES.UNEXPECTED, {
        state: { correlationId: error.response?.headers["x-correlation-id"] },
      });
    },
  });
};
