import { useMutation, useQuery } from "@tanstack/react-query";

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
 * @param loaNumber LOA number of the LOA to fetch
 * @returns Query result of the LOA details
 */
export const useFetchLOADetail = (companyId: number, loaNumber?: Nullable<string>) => {
  return useQuery({
    queryKey: [LOA_QUERY_KEY, loaNumber],
    queryFn: () => {
      if (!loaNumber) return undefined;
      return getLOADetail(companyId, loaNumber);
    },
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled: Boolean(loaNumber),
  });
};

/**
 * Hook to create an LOA for a company.
 * @returns Result of creating the LOA
 */
export const useCreateLOAMutation = () => {
  return useMutation({
    mutationFn: createLOA,
  });
};

/**
 * Hook to update an LOA for a company.
 * @returns Result of updating the LOA
 */
export const useUpdateLOAMutation = () => {
  return useMutation({
    mutationFn: updateLOA,
  });
};

/**
 * Hook to remove an LOA for a company.
 * @returns Result of removing the LOA
 */
export const useRemoveLOAMutation = () => {
  return useMutation({
    mutationFn: removeLOA,
  });
};