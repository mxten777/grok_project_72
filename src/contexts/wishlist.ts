import { createContext } from 'react';
import type { WishlistState, WishlistAction } from './WishlistContext';

export const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
} | null>(null);
