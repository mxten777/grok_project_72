import { createContext } from 'react';
import type { CartState, CartAction } from './CartContext';

export const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);
