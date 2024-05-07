import { CartItem } from "../types/CartItem";

/**
 * Get cart items that are no longer present.
 * This usually happens when an item has been removed elsewhere, and current page isn't aware yet.
 * @param oldItems Old cart items
 * @param newItems New cart items
 * @returns Items removed from the old cart items (ones not present in the new items)
 */
export const getOutdatedCartItems = (
  oldItems: CartItem[],
  newItems: CartItem[],
) => {
  const oldIds = new Set(oldItems.map(item => item.applicationId));
  const newIds = new Set(newItems.map(item => item.applicationId));
  const oldRemovedIds = new Set([...oldIds].filter(oldId => !newIds.has(oldId)));
  return oldItems.filter(item => oldRemovedIds.has(item.applicationId));
};
