import type { Product, PriceRule } from '../types';
import { Timestamp } from 'firebase/firestore';

const POLICIES = {
    A: { discount: 0.1 }, // 10%
    B: { discount: 0.05 }, // 5%
    C: { discount: 0 }, // 0%
};

export const calculateDiscountedPrice = (price: number, grade?: 'A' | 'B' | 'C') => {
    if (!grade || !POLICIES[grade]) {
        return price;
    }
    const discount = POLICIES[grade].discount;
    return price * (1 - discount);
};

// 가격 규칙 적용 로직
export const applyPriceRules = (products: Product[], rules: PriceRule[]): Product[] => {
  if (!rules || rules.length === 0) {
    return products;
  }

  const now = new Date();

  // 현재 활성화된 규칙 필터링
  const activeRules = rules.filter(rule => {
    const startDate = (rule.startDate as Timestamp).toDate();
    const endDate = rule.endDate ? (rule.endDate as Timestamp).toDate() : null;
    return startDate <= now && (!endDate || endDate >= now);
  });

  if (activeRules.length === 0) {
    return products;
  }

  return products.map(product => {
    const newProduct = { ...product, originalPrice: product.price };
    let finalPrice = product.price;

    // 우선순위에 따라 규칙 정렬 (낮은 숫자 우선)
    const sortedRules = [...activeRules].sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      const appliesToProduct = rule.productIds.includes(product.id) || rule.category === 'all' || rule.category === product.category;

      if (appliesToProduct) {
        if (rule.type === 'percentage') {
          finalPrice = finalPrice * (1 - rule.discountValue / 100);
        } else if (rule.type === 'fixed') {
          finalPrice = finalPrice - rule.discountValue;
        } else if (rule.type === 'set') {
          finalPrice = rule.discountValue;
        }
        
        if (rule.exclusive) {
          break; // 배타적 규칙이면 더 이상 다른 규칙을 적용하지 않음
        }
      }
    }
    
    newProduct.price = Math.max(0, finalPrice); // 가격이 0보다 작아지지 않도록
    return newProduct;
  });
};
