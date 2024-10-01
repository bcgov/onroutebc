import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToCart,
  fetchCart,
  getCartCount,
  removeFromCart,
} from "../apiManager/cart";
import { Nullable } from "../../../common/types/common";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { getApplication } from "../apiManager/permitsAPI";

const CART_KEY = "cart";
const CART_COUNT_KEY = "cart-count";
const CART_ITEM = "cart-item";

/**
 * Hook used to manage adding items to cart.
 * @returns Mutation object for adding items to cart
 */
export const useAddToCart = () => {
  return useMutation({
    mutationFn: ({
      companyId,
      applicationIds,
    }: {
      companyId: string;
      applicationIds: string[];
    }) => addToCart(companyId, applicationIds),
  });
};

/**
 * Hook used to fetch cart items.
 * @param companyId id of company to fetch cart items for
 * @param fetchAllApplications Optional flag to fetch all applications for company (Company Admins only)
 * @returns Query object for fetching cart items
 */
export const useFetchCart = (
  companyId: string,
  fetchAllApplications?: boolean,
) => {
  return useQuery({
    queryKey: [CART_KEY, fetchAllApplications],
    queryFn: () => fetchCart(companyId, fetchAllApplications),
    enabled: Boolean(companyId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook used to remove items from cart.
 * @returns Mutation object for removing items from cart
 */
export const useRemoveFromCart = () => {
  return useMutation({
    mutationFn: ({
      companyId,
      applicationIds,
    }: {
      companyId: string;
      applicationIds: string[];
    }) => removeFromCart(companyId, applicationIds),
  });
};

/**
 * Hook used to get the number of items in the cart.
 * @param companyId id of company to get cart item count for
 * @returns Query object used for getting cart item count
 */
export const useGetCartCount = (companyId?: Nullable<string>) => {
  const cartCompanyId = getDefaultRequiredVal("", companyId);

  return useQuery({
    queryKey: [CART_COUNT_KEY, companyId],
    queryFn: () => getCartCount(cartCompanyId),
    enabled: Boolean(companyId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook used to fetch the latest status of a cart item./
 * @returns Latest status of selected cart item and method to fetch its latest status
 */
export const useFetchCartItemStatus = () => {
  const queryClient = useQueryClient();
  const [cartItemId, setCartItemId] = useState<Nullable<string>>();

  const cartItemDetailQuery = useQuery({
    queryKey: [CART_ITEM, cartItemId],
    queryFn: () => getApplication(cartItemId),
    enabled: Boolean(cartItemId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: cartItemData } = cartItemDetailQuery;

  return {
    cartItemId,
    cartItemData,
    fetchStatusFor: (id: string) => {
      if (id !== cartItemId) {
        setCartItemId(id);
      } else {
        // Force refetch and update of query data
        queryClient.resetQueries({
          queryKey: [CART_ITEM, id],
        });
      }
    },
  };
};
