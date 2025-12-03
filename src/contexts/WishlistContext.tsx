/**
 * 위시리스트 상태 관리 Context
 *
 * React Context API를 사용하여 애플리케이션 전역에서 위시리스트 상태를 관리합니다.
 * 상품 추가, 제거 등의 기능을 제공합니다.
 */

import { useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';
import { WishlistContext } from './wishlist';

export interface WishlistState {
  items: Product[];
}

export type WishlistAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR_WISHLIST' };

export { WishlistContext };

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.product.id);
      if (!existingItem) {
        return {
          items: [...state.items, action.product],
        };
      }
      return state;
    }
    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter(item => item.id !== action.productId),
      };
    }
    case 'CLEAR_WISHLIST':
      return { items: [] };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};