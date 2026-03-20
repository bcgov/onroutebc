import { createContext } from "react";

export interface CartContextType {
  cartCount: number;
  refetchCartCount: () => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refetchCartCount: async () => undefined,
});
