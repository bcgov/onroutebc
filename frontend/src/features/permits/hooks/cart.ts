import { useMutation, useQuery } from "@tanstack/react-query";
import { addToCart, fetchCart, getCartCount, removeFromCart } from "../apiManager/cart";

const CART_KEY = "cart";
const CART_COUNT_KEY = "cart-count";

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
    queryKey: [CART_KEY],
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
export const useGetCartCount = (companyId: string) => {
  return useQuery({
    queryKey: [CART_COUNT_KEY],
    queryFn: () => getCartCount(companyId),
    enabled: Boolean(companyId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};
