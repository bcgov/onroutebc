import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "../../../common/types/common";
import {
  createLOA,
  getLOADetail,
  getLOAs,
  removeLOA,
  updateLOA,
} from "../apiManager/specialAuthorization";

const LOAS_QUERY_KEY = "loas";
const LOA_QUERY_KEY = "loa";

/**
 * Hook to fetch the LOAs for a company.
 * @param companyId Company id of the company to fetch LOAs for
 * @param expired Whether or not to only fetch expired LOAs
 * @returns Query result of the company's LOAs
 */
export const useFetchLOAs = (companyId: number | string, expired: boolean) => {
  return useQuery({
    queryKey: [LOAS_QUERY_KEY, expired],
    queryFn: () => getLOAs(companyId, expired),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch the LOA details for a company's LOA.
 * @param companyId Company id of the company to fetch LOA for
 * @param loaId id of the LOA to fetch
 * @returns Query result of the LOA details
 */
export const useFetchLOADetail = (companyId: number, loaId?: Nullable<string>) => {
  return useQuery({
    queryKey: [LOA_QUERY_KEY, loaId],
    queryFn: () => {
      if (!loaId) return undefined;
      return getLOADetail(companyId, loaId);
    },
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled: Boolean(loaId),
  });
};

/**
 * Hook to create an LOA for a company.
 * @returns Result of creating the LOA
 */
export const useCreateLOAMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLOA,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LOAS_QUERY_KEY, true],
      });
    },
  });
};

/**
 * Hook to update an LOA for a company.
 * @returns Result of updating the LOA
 */
export const useUpdateLOAMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLOA,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [LOAS_QUERY_KEY, true],
      });
      queryClient.invalidateQueries({
        queryKey: [LOA_QUERY_KEY, response.data.loaId],
      });
    },
  });
};

/**
 * Hook to remove an LOA for a company.
 * @returns Result of removing the LOA
 */
export const useRemoveLOAMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeLOA,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LOAS_QUERY_KEY, true],
      });
    },
  });
};
